// src/main.cpp - ESP8266 DOCUMENTED VERSION

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <DNSServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include "FS.h"
#include "LittleFS.h"
#include <Updater.h>
#include "MakitaBMS.h"

// --- Forward declarations (prototypes) ---
void saveConfig(const String& lang, const String& theme, const String& ssid = "", const String& pass = "");
void loadConfig(String& lang, String& theme, String& wifi_ssid, String& wifi_pass);
void maintainMDNS();
String textForLang(const String& key);

// --- Global settings and objects ---
// D1 mini board pin for single-wire communication (OneWire)
#define ONEWIRE_PIN D4
// D1 mini board pin connected to the battery EN line
#define ENABLE_PIN  D5

// DNS server used to support the captive portal (automatic redirection)
DNSServer dnsServer;
// Asynchronous web server on standard port 80
AsyncWebServer server(80);
// WebSocket channel for real-time communication with the web interface
AsyncWebSocket ws("/ws");
// SSID of the WiFi access point created by the ESP8266
const char* ssid_ap = "Makita_OBI";
// Hostname for mDNS access on the local network: http://makita.local
const char* mdns_hostname = "makita";

// Instance of the Makita BMS controller class
MakitaBMS bms(ONEWIRE_PIN, ENABLE_PIN);

// Global data cache used to keep static information while requesting dynamic updates
static BatteryData cached_data;
// Persistent configuration (WiFi Station)
static String current_lang = "en";
static String current_theme = "dark";
static String current_wifi_ssid = "";
static String current_wifi_pass = "";
static bool mdns_started = false;
static unsigned long lastMDNSAttempt = 0;
const unsigned long MDNS_RETRY_INTERVAL = 5000; // Retry every 5 seconds until Station WiFi is connected

// Interval control variables
unsigned long lastPresenceCheck = 0;
bool lastPresenceState = false;
const unsigned long PRESENCE_INTERVAL = 4000; // 4 seconds between checks

// --- Communication functions ---

/**
 * Sends the battery information formatted as JSON to all connected clients.
 * @param type Message type (static_data or dynamic_data)
 * @param data Structure containing the values read from the battery
 * @param features Pointer to the supported features (optional)
 */
void sendJsonResponse(const String& type, const BatteryData& data, const SupportedFeatures* features) {
    if (ws.count() == 0) return;
    DynamicJsonDocument doc(2048);
    doc["type"] = type;

    JsonObject dataObj = doc.createNestedObject("data");
    dataObj["model"] = data.model;
    dataObj["charge_cycles"] = data.charge_cycles;
    dataObj["lock_status"] = data.lock_status;
    dataObj["status_code"] = data.status_code;
    dataObj["mfg_date"] = data.mfg_date;
    dataObj["capacity"] = data.capacity;
    dataObj["battery_type"] = data.battery_type;
    dataObj["pack_voltage"] = data.pack_voltage;
    JsonArray cellV = dataObj.createNestedArray("cell_voltages");
    for(int i=0; i<data.cell_count; i++) cellV.add(data.cell_voltages[i]);
    dataObj["cell_diff"] = data.cell_diff;
    dataObj["temp1"] = data.temp1;
    dataObj["temp2"] = data.temp2;
    dataObj["rom_id"] = data.rom_id;

    if (features) {
        JsonObject featuresObj = doc.createNestedObject("features");
        featuresObj["read_dynamic"] = features->read_dynamic;
        featuresObj["led_test"] = features->led_test;
        featuresObj["clear_errors"] = features->clear_errors;
    }

    String output;
    serializeJson(doc, output);
    ws.textAll(output);
}

/**
 * Sends a success, error, or informational message to the web interface.
 */
void sendFeedback(const String& type, const String& message) {
    if (ws.count() == 0) return;
    DynamicJsonDocument doc(512);
    doc["type"] = type;
    doc["message"] = message;
    String output;
    serializeJson(doc, output);
    ws.textAll(output);
}

/**
 * Notifies clients whether a battery is physically detected on the bus.
 */
void sendPresence(bool is_present) {
    if (ws.count() == 0) return;
    DynamicJsonDocument doc(64);
    doc["type"] = "presence";
    doc["present"] = is_present;
    String output;
    serializeJson(doc, output);
    ws.textAll(output);
}

/**
 * Sends system log messages to the web interface for remote debugging.
 */
void logToClients(const String& message, LogLevel level) {
    Serial.println(message);
    String prefix = (level == LOG_LEVEL_DEBUG) ? "[DBG] " : "";
    sendFeedback("debug", prefix + message);
}

/**
 * Returns short firmware-originated UI/log messages in the configured language.
 */
String textForLang(const String& key) {
    if (current_lang == "nl") {
        if (key == "led_on") return "LED AAN-opdracht verzonden.";
        if (key == "led_off") return "LED UIT-opdracht verzonden.";
        if (key == "clear_errors") return "Opdracht fouten wissen verzonden.";
        if (key == "log_level") return "Logniveau: ";
        if (key == "settings_saved") return "Instellingen opgeslagen.";
        if (key == "wifi_restart") return "Wifi geconfigureerd. Opnieuw opstarten...";
        if (key == "battery_disconnected") return "Accu losgekoppeld.";
    }

    if (key == "led_on") return "LED ON command sent.";
    if (key == "led_off") return "LED OFF command sent.";
    if (key == "clear_errors") return "Clear errors command sent.";
    if (key == "log_level") return "Log level: ";
    if (key == "settings_saved") return "Settings saved.";
    if (key == "wifi_restart") return "WiFi configured. Restarting...";
    if (key == "battery_disconnected") return "Battery disconnected.";

    return key;
}

/**
 * Main WebSocket event handler: processes commands from the web interface.
 */
void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
    if (type == WS_EVT_CONNECT) {
        Serial.printf("WS client #%u connected\n", client->id());
        sendPresence(bms.isPresent());
    } else if (type == WS_EVT_DISCONNECT) {
        Serial.printf("WS client #%u disconnected\n", client->id());
    } else if (type == WS_EVT_DATA) {
        DynamicJsonDocument doc(512);
        if (deserializeJson(doc, (const char*)data, len) != DeserializationError::Ok) return;
        
        String command = doc["command"];

        if (command == "presence") {
            sendPresence(bms.isPresent());
        } else if (command == "read_static") {
            // One-time read of the battery master data
            BatteryData fresh_data;
            SupportedFeatures fresh_features;
            BMSStatus status = bms.readStaticData(fresh_data, fresh_features);
            if (status == BMSStatus::OK) {
                cached_data = fresh_data;
                sendJsonResponse("static_data", cached_data, &fresh_features);
                sendPresence(true);
            } else {
                sendFeedback("error", statusToString(status, current_lang));
            }
        } else if (command == "read_dynamic") {
            // Read current voltages and temperatures
            BMSStatus status = bms.readDynamicData(cached_data);
            if (status == BMSStatus::OK) {
                sendJsonResponse("dynamic_data", cached_data, nullptr);
            } else {
                sendFeedback("error", statusToString(status, current_lang));
            }
        } else if (command == "led_on") {
            // Turns on the battery LEDs (STANDARD models only)
            BMSStatus status = bms.ledTest(true);
            if (status == BMSStatus::OK) sendFeedback("success", textForLang("led_on"));
            else sendFeedback("error", statusToString(status, current_lang));
        } else if (command == "led_off") {
            // Turns off the battery LEDs
            BMSStatus status = bms.ledTest(false);
            if (status == BMSStatus::OK) sendFeedback("success", textForLang("led_off"));
            else sendFeedback("error", statusToString(status, current_lang));
        } else if (command == "clear_errors") {
            // Attempts to reset the controller error counters
            BMSStatus status = bms.clearErrors();
            if (status == BMSStatus::OK) sendFeedback("success", textForLang("clear_errors"));
            else sendFeedback("error", statusToString(status, current_lang));
        } else if (command == "set_logging") {
            // Enables or disables detailed debugging
            bool enabled = doc["enabled"];
            bms.setLogLevel(enabled ? LOG_LEVEL_DEBUG : LOG_LEVEL_INFO);
            logToClients(textForLang("log_level") + (enabled ? "DEBUG" : "INFO"), LOG_LEVEL_INFO);
        } else if (command == "get_config") {
            DynamicJsonDocument configDoc(256);
            configDoc["type"] = "config";
            configDoc["lang"] = current_lang;
            configDoc["theme"] = current_theme;
            String out;
            serializeJson(configDoc, out);
            client->text(out);
        } else if (command == "save_config") {
            String requested_lang = doc["lang"] | current_lang;
            String requested_theme = doc["theme"] | current_theme;
            if (requested_lang == "nl" || requested_lang == "en") {
                current_lang = requested_lang;
            }
            if (requested_theme == "dark" || requested_theme == "light") {
                current_theme = requested_theme;
            }
            saveConfig(current_lang, current_theme, current_wifi_ssid, current_wifi_pass);
            logToClients(textForLang("settings_saved"), LOG_LEVEL_INFO);
        } else if (command == "set_wifi") {
            current_wifi_ssid = doc["ssid"].as<String>();
            current_wifi_pass = doc["pass"].as<String>();
            saveConfig(current_lang, current_theme, current_wifi_ssid, current_wifi_pass);
            logToClients(textForLang("wifi_restart"), LOG_LEVEL_INFO);
            delay(1000);
            ESP.restart();
        }
    }
}

// Handler class used to force captive portal redirection to index.html
class CaptiveRequestHandler : public AsyncWebHandler {
public:
    CaptiveRequestHandler() {}
    virtual ~CaptiveRequestHandler() {}
    bool canHandle(AsyncWebServerRequest *request){ return true; }
    void handleRequest(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse(LittleFS, "/index.html", "text/html");
        response->addHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        response->addHeader("Pragma", "no-cache");
        request->send(response);
    }
};

/**
 * Configuration persistence in flash memory.
 */
void saveConfig(const String& lang, const String& theme, const String& wifi_ssid, const String& wifi_pass) {
    File file = LittleFS.open("/config.json", "w");
    if (!file) return;
    DynamicJsonDocument doc(512);
    doc["lang"] = lang;
    doc["theme"] = theme;
    doc["wifi_ssid"] = wifi_ssid;
    doc["wifi_pass"] = wifi_pass;
    serializeJson(doc, file);
    file.close();
}

void loadConfig(String& lang, String& theme, String& wifi_ssid, String& wifi_pass) {
    if (!LittleFS.exists("/config.json")) return;
    File file = LittleFS.open("/config.json", "r");
    if (!file) return;
    DynamicJsonDocument doc(512);
    if (deserializeJson(doc, file) != DeserializationError::Ok) {
        file.close();
        return;
    }
    lang = doc["lang"] | "en";
    if (lang != "nl" && lang != "en") lang = "en";
    theme = doc["theme"] | "dark";
    wifi_ssid = doc["wifi_ssid"] | "";
    wifi_pass = doc["wifi_pass"] | "";
    file.close();
}

/**
 * Starts and services mDNS once the ESP8266 is connected as a Station.
 * mDNS is not reliable from the SoftAP-only side because .local is reserved
 * for multicast name resolution on the client network.
 */
void maintainMDNS() {
    if (WiFi.status() != WL_CONNECTED) {
        if (mdns_started) {
            MDNS.close();
            mdns_started = false;
            Serial.println("mDNS stopped: WiFi Station disconnected.");
        }
        return;
    }

    if (!mdns_started) {
        unsigned long now = millis();
        if (lastMDNSAttempt != 0 && now - lastMDNSAttempt < MDNS_RETRY_INTERVAL) {
            return;
        }

        lastMDNSAttempt = now;
        if (MDNS.begin(mdns_hostname)) {
            MDNS.addService("http", "tcp", 80);
            mdns_started = true;
            Serial.printf("mDNS started: http://%s.local (%s)\n", mdns_hostname, WiFi.localIP().toString().c_str());
        } else {
            Serial.println("Error starting mDNS. Retrying.");
        }
    }

    MDNS.update();
}

void setup() {
    Serial.begin(115200);
    Serial.println("\nStarting Makita BMS Tool...");
    
    // Initialize the LittleFS filesystem
    if(!LittleFS.begin()){ 
        Serial.println("Error mounting LittleFS");
        return; 
    }
    Serial.println("LittleFS mounted successfully.");
    
    // Load saved configuration
    loadConfig(current_lang, current_theme, current_wifi_ssid, current_wifi_pass);
    Serial.printf("Configuration loaded: Lang=%s, Theme=%s\n", current_lang.c_str(), current_theme.c_str());

    bms.setLogCallback(logToClients);

    // Dual WiFi mode: SoftAP + Station
    WiFi.hostname(mdns_hostname);
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(ssid_ap);
    Serial.print("Access point started: ");
    Serial.println(WiFi.softAPIP());

    if (current_wifi_ssid.length() > 0) {
        Serial.printf("Trying to connect to WiFi: %s\n", current_wifi_ssid.c_str());
        WiFi.begin(current_wifi_ssid.c_str(), current_wifi_pass.c_str());
        // Do not block setup; the connection is handled in the background
    }
    
    ws.onEvent(onWebSocketEvent);
    server.addHandler(&ws);

    // OTA endpoint
    server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request){
        bool updateFailed = Update.hasError();
        AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", updateFailed ? "FAIL" : "OK");
        response->addHeader("Connection", "close");
        request->send(response);
        if(!updateFailed) ESP.restart();
    }, [&](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
        if (!index) {
            Serial.printf("Update started: %s\n", filename.c_str());
            const uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;
            if (!Update.begin(maxSketchSpace)) {
                Update.printError(Serial);
            }
        }
        if (!Update.hasError()) {
            if (Update.write(data, len) != len) {
                Update.printError(Serial);
            }
        }
        if (final) {
            if (Update.end(true)) {
                Serial.printf("Update completed: %u bytes\n", index + len);
            } else {
                Update.printError(Serial);
            }
        }
    });

    // Serve static files
    server.serveStatic("/", LittleFS, "/")
        .setDefaultFile("index.html")
        .setCacheControl("no-store, no-cache, must-revalidate, max-age=0");
    
    dnsServer.start(53, "*", WiFi.softAPIP());
    server.addHandler(new CaptiveRequestHandler());
    
    server.begin();
    Serial.println("Servidor HTTP/WS listo.");
    maintainMDNS();
}

void loop() {
    // Process DNS requests for the captive portal
    dnsServer.processNextRequest();

    // Clean up inactive WebSocket clients
    ws.cleanupClients();

    // Keep mDNS alive and retry after Station WiFi connects
    maintainMDNS();

    // Presence ticker: automatically notifies state changes
    unsigned long now = millis();
    if (now - lastPresenceCheck > PRESENCE_INTERVAL) {
        lastPresenceCheck = now;
        bool currentPresence = bms.isPresent();
        if (currentPresence != lastPresenceState) {
            lastPresenceState = currentPresence;
            sendPresence(currentPresence);
            
            // If the battery disappears, report it in the log
            if (!currentPresence) {
                logToClients(textForLang("battery_disconnected"), LOG_LEVEL_INFO);
            }
        }
    }
}
