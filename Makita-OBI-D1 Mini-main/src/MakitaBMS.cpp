// src/MakitaBMS.cpp - OPTIMIZED AND DOCUMENTED VERSION

#include "MakitaBMS.h"

// --- Static command definitions (required by the linker in C++14) ---
constexpr byte MakitaBMS::CMD_READ_STATIC[];
constexpr byte MakitaBMS::CMD_READ_DYNAMIC[];
constexpr byte MakitaBMS::CMD_LED_TEST_INIT[];
constexpr byte MakitaBMS::CMD_LED_ON[];
constexpr byte MakitaBMS::CMD_LED_OFF[];
constexpr byte MakitaBMS::CMD_CLEAR_ERR_INIT[];
constexpr byte MakitaBMS::CMD_CLEAR_ERR_EXEC[];
constexpr byte MakitaBMS::CMD_GET_MODEL[];

/**
 * Converts the internal BMS status to a readable text message.
 */
String statusToString(BMSStatus status, const String& lang) {
    if (lang == "nl") {
        switch (status) {
            case BMSStatus::OK: return "";
            case BMSStatus::ERROR_NOT_PRESENT: return "Accu niet fysiek gedetecteerd.";
            case BMSStatus::ERROR_NOT_IDENTIFIED: return "Eerst moet de accu worden geidentificeerd (statische uitlezing).";
            case BMSStatus::ERROR_MODEL_NOT_SUPPORTED: return "Het accumodel wordt niet ondersteund door deze tool.";
            case BMSStatus::ERROR_COMMUNICATION: return "Fout in de integriteit van ontvangen gegevens.";
            case BMSStatus::ERROR_NOT_AVAILABLE: return "Deze functie is niet beschikbaar voor het huidige model.";
            default: return "Onbekende systeemfout.";
        }
    }

    switch (status) {
        case BMSStatus::OK: return "";
        case BMSStatus::ERROR_NOT_PRESENT: return "Battery not physically detected.";
        case BMSStatus::ERROR_NOT_IDENTIFIED: return "Battery must be identified first (static read).";
        case BMSStatus::ERROR_MODEL_NOT_SUPPORTED: return "Battery model is not supported by this tool.";
        case BMSStatus::ERROR_COMMUNICATION: return "Error in data integrity of received data.";
        case BMSStatus::ERROR_NOT_AVAILABLE: return "This function is not available for the current model.";
        default: return "Unknown system error.";
    }
}

/**
 * MakitaBMS class constructor.
 * Configures the communication and battery-enable pins.
 */
MakitaBMS::MakitaBMS(uint8_t onewire_pin, uint8_t enable_pin) 
    : makita(onewire_pin), _enable_pin(enable_pin) {
    pinMode(_enable_pin, OUTPUT);
    setEnable(false);
}

void MakitaBMS::setLogCallback(LogCallback callback) { _log = callback; }
void MakitaBMS::setLogLevel(LogLevel level) { _logLevel = level; }

void MakitaBMS::setEnable(bool enabled) {
    digitalWrite(_enable_pin, enabled ? HIGH : LOW);
}

/**
 * Sends text messages through the registered callback (Serial/Web).
 */
void MakitaBMS::logger(const String& message, LogLevel level) { 
    if (_log && level <= _logLevel) _log(message, level); 
}

/**
 * Helper used to print data blocks in hexadecimal format (deep debugging).
 */
void MakitaBMS::log_hex(const String& prefix, const byte* data, int len) { 
    if (_logLevel < LOG_LEVEL_DEBUG || !_log) return; 
    String hex_str;
    hex_str.reserve(prefix.length() + len * 3);
    hex_str = prefix; 
    if (data && len > 0) {
        for (int i = 0; i < len; i++) { 
            char buf[4]; 
            sprintf(buf, "%02X ", data[i]); 
            hex_str += buf; 
        } 
    }
    _log(hex_str, LOG_LEVEL_DEBUG); 
}

/**
 * Executes a command/response transaction using the 'CC' protocol type (common).
 */
void MakitaBMS::cmd_and_read_cc(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len) { 
    makita.reset(); 
    delayMicroseconds(400); 
    makita.write(0xcc); // CC-type control byte
    log_hex(">> CC (cmd): ", cmd, cmd_len); 
    if (cmd != nullptr) for (int i = 0; i < cmd_len; i++) { makita.write(cmd[i]); delayMicroseconds(90); } 
    if (rsp != nullptr) for (int i = 0; i < rsp_len; i++) { rsp[i] = makita.read(); delayMicroseconds(90); } 
    log_hex("<< CC (rsp): ", rsp, rsp_len); 
}

/**
 * Executes a complex transaction using the '33' protocol type.
 * This protocol requires an initial 8-byte read (ROM ID) before sending the command.
 */
void MakitaBMS::cmd_and_read_33(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len) {
    makita.reset();
    delayMicroseconds(400);
    makita.write(0x33); // 33-type control byte
    log_hex(">> 33 (env): ", cmd, cmd_len);
    byte initial_read[8];
    for (int i = 0; i < 8; i++) { initial_read[i] = makita.read(); delayMicroseconds(90); }
    log_hex("<< 33 (8b ROM): ", initial_read, 8);
    for (int i = 0; i < cmd_len; i++) { makita.write(cmd[i]); delayMicroseconds(90); }
    for (int i = 0; i < rsp_len; i++) { rsp[i] = makita.read(); delayMicroseconds(90); }
    log_hex("<< 33 (rsp): ", rsp, rsp_len);
}

/**
 * Checks whether a battery is physically connected to the port.
 */
bool MakitaBMS::isPresent() {
    setEnable(true);
    delay(400); 
    
    // Preliminary check: the line should be HIGH (idle) thanks to the pull-up.
    // If it is LOW without sending anything, there may be a short or a noisy bus.
    // Use digitalRead directly on the pin configured in OneWireMakita
    bool present = makita.reset();   // Try to reset the bus and capture the presence pulse
    
    setEnable(false);
    
    if (present) {
        logger("Presence: battery detected", LOG_LEVEL_INFO);
    } else {
        logger("Presence: empty bus", LOG_LEVEL_INFO);
    }
    return present;
}

/**
 * Identifies the battery by reading the static master data table.
 * Determines the processor model and the available features.
 */
BMSStatus MakitaBMS::readStaticData(BatteryData &data, SupportedFeatures &features) {
    logger("--- Reading static data (identification) ---", LOG_LEVEL_INFO);
    _is_identified = false;
    
    setEnable(true);
    delay(400);

    byte response[40];
    if (!makita.reset()) {
        setEnable(false);
        return BMSStatus::ERROR_NOT_PRESENT;
    }
    delayMicroseconds(400);
    makita.write(0x33);
    
    // Protocol 33 is unusual: read 8 bytes, write the command, then read the rest
    byte initial_read[8]; 
    for (int i = 0; i < 8; i++) { initial_read[i] = makita.read(); delayMicroseconds(90); }
    for (int i = 0; i < 2; i++) { makita.write(CMD_READ_STATIC[i]); delayMicroseconds(90); }
    
    byte remaining[32]; 
    for (int i = 0; i < 32; i++) { remaining[i] = makita.read(); delayMicroseconds(90); }
    
    memcpy(response, initial_read, 8);
    memcpy(response + 8, remaining, 32);

    // Parse the battery master fields
    data.charge_cycles = ((nibble_swap(response[34]) << 8) | nibble_swap(response[35])) & 0x0FFF;
    data.lock_status = (response[28] & 0x0F) > 0 ? "LOCKED" : "UNLOCKED";
    
    char buf[16]; 
    snprintf(buf, sizeof(buf), "%02X", response[27]); data.status_code = buf;
    snprintf(buf, sizeof(buf), "%02d/%02d/20%02d", response[2], response[1], response[0]); data.mfg_date = buf;
    data.capacity = String(nibble_swap(response[24]) / 10.0f, 1) + "Ah";
    data.battery_type = String(nibble_swap(response[19]));
    
    data.rom_id = "";
    data.rom_id.reserve(24);
    for(int i = 0; i < 8; i++) { char r_buf[4]; sprintf(r_buf, "%02X ", response[i]); data.rom_id += r_buf; }
    
    // Try to identify whether this is a standard controller or the newer F0513
    _controller = ControllerType::UNKNOWN; 
    String m_str = getModel(); 
    if (m_str != "") { _controller = ControllerType::STANDARD; data.model = m_str; } 
    else { m_str = getF0513Model(); if (m_str != "") { _controller = ControllerType::F0513; data.model = m_str; } }

    // Automatic cell-count detection based on the model
    if (data.model.startsWith("BL14")) {
        data.cell_count = 4;
    } else {
        data.cell_count = 5;
    }
    
    setEnable(false);

    if (_controller == ControllerType::UNKNOWN) return BMSStatus::ERROR_MODEL_NOT_SUPPORTED;

    _is_identified = true; 
    features.read_dynamic = true; // Both support cell reading
    if (_controller == ControllerType::STANDARD) { 
        features.led_test = true; 
        features.clear_errors = true; 
    }
    
    logger("Identification finished: " + data.model, LOG_LEVEL_INFO); 
    return BMSStatus::OK;
}

/**
 * Reads current voltages and temperatures.
 * Uses different algorithms depending on the previously detected controller.
 */
BMSStatus MakitaBMS::readDynamicData(BatteryData &data) {
    if (!_is_identified) return BMSStatus::ERROR_NOT_IDENTIFIED;
    logger("--- Reading voltages and temperatures ---", LOG_LEVEL_INFO); 
    
    if (_controller == ControllerType::STANDARD) { 
        setEnable(true);
        delay(400);

        byte rsp[29]; 
        cmd_and_read_cc(CMD_READ_DYNAMIC, 4, rsp, sizeof(rsp)); 
        
        // Convert bytes to real voltages
        data.pack_voltage = ((rsp[1] << 8) | rsp[0]) / 1000.0f; 
        float min_v = 5.0, max_v = 0.0; 
        for(int i=0; i<data.cell_count; i++) { 
            float val = ((rsp[i*2+3] << 8) | rsp[i*2+2]) / 1000.0f; 
            data.cell_voltages[i] = val; 
            if (val > 0.5 && val < min_v) min_v = val; 
            if (val > max_v) max_v = val; 
        } 
        // Clear unused cells when using a 4S pack
        if (data.cell_count < 5) {
            for(int i=data.cell_count; i<5; i++) data.cell_voltages[i] = 0.0;
        }
        data.cell_diff = (max_v > min_v) ? (max_v - min_v) : 0.0; 
        data.temp1 = ((rsp[15] << 8) | rsp[14]) / 100.0f; 
        data.temp2 = ((rsp[17] << 8) | rsp[16]) / 100.0f; 

        setEnable(false);

    } else if (_controller == ControllerType::F0513) {
        // The F0513 controller needs the EN line pulsed for each command.
        auto exec = [&](const byte* c, uint8_t cl, byte* r, uint8_t rl) {
            setEnable(true); delay(400);
            cmd_and_read_cc(c, cl, r, rl);
            setEnable(false); delay(50);
        };

        const byte clr[] = {0xF0, 0x00};
        exec(clr, 2, nullptr, 0); exec(clr, 2, nullptr, 0);
        
        byte r[2]; float v[5], t_v = 0;
        // Request each cell voltage separately
        for(int i=0; i<data.cell_count; i++) {
            byte cmd_b = (byte)(0x31 + i);
            exec(&cmd_b, 1, r, 2);
            v[i] = ((r[1]<<8)|r[0])/1000.0f;
        }
        
        byte cmd_52 = 0x52;
        exec(&cmd_52, 1, r, 2); data.temp1=((r[1]<<8)|r[0])/100.0f;
        
        float min_v = 5.0, max_v = 0.0;
        for(int i=0; i<5; i++) { 
            if (i < data.cell_count) {
                data.cell_voltages[i] = v[i]; t_v += v[i]; 
                if(v[i] > 0.5 && v[i] < min_v) min_v = v[i]; 
                if(v[i] > max_v) max_v = v[i]; 
            } else {
                data.cell_voltages[i] = 0.0;
            }
        }
        data.pack_voltage = t_v; 
        data.cell_diff = (max_v > 0.5 && max_v > min_v) ? (max_v - min_v) : 0.0;
        data.temp2 = 0;
    }
    
    logger("Lectura dinamica completada.", LOG_LEVEL_INFO); 
    return BMSStatus::OK;
}

String MakitaBMS::getModel() {
    byte rsp[16];
    cmd_and_read_cc(CMD_GET_MODEL, 2, rsp, sizeof(rsp));
    if (rsp[0] == 0xFF || rsp[0] == 0x00) return "";
    char m[8]; memcpy(m, rsp, 7); m[7] = '\0';
    return String(m);
}

String MakitaBMS::getF0513Model() {
    byte cmd_99 = 0x99;
    cmd_and_read_cc(&cmd_99, 1, nullptr, 0); delay(100);
    makita.reset(); delayMicroseconds(400); makita.write(0x31);
    byte r[2];
    delayMicroseconds(90); r[0] = makita.read(); delayMicroseconds(90); r[1] = makita.read(); 
    byte cmd_f0[] = {0xF0, 0x00};
    cmd_and_read_cc(cmd_f0, 2, nullptr, 0);
    if (r[0] == 0xFF && r[1] == 0xFF) return "";
    char b[8]; sprintf(b, "BL%02X%02X", r[1], r[0]);
    return String(b);
}

/**
 * Direct control of the LEDs on the battery board.
 */
BMSStatus MakitaBMS::ledTest(bool on) { 
    if (!_is_identified || _controller != ControllerType::STANDARD) return BMSStatus::ERROR_NOT_AVAILABLE;
    
    // 1. Initialization command
    setEnable(true); delay(400);
    byte b[9]; 
    cmd_and_read_33(CMD_LED_TEST_INIT, 3, b, 9); 
    setEnable(false); delay(50);

    // 2. Execution command (requires BMS reconnection/power-cycle)
    setEnable(true); delay(400);
    cmd_and_read_33(on ? CMD_LED_ON : CMD_LED_OFF, 2, b, 9); 
    setEnable(false);
    
    return BMSStatus::OK; 
}

/**
 * Attempts to clear persistent errors and unlock the controller.
 */
BMSStatus MakitaBMS::clearErrors() { 
    if (!_is_identified || _controller != ControllerType::STANDARD) return BMSStatus::ERROR_NOT_AVAILABLE;
    
    // 1. Initialization command
    setEnable(true); delay(400);
    byte b[9]; 
    cmd_and_read_33(CMD_CLEAR_ERR_INIT, 3, b, 9); 
    setEnable(false); delay(50);
    
    // 2. Execution command (requires BMS reconnection/power-cycle)
    setEnable(true); delay(400);
    cmd_and_read_33(CMD_CLEAR_ERR_EXEC, 2, b, 9); 
    setEnable(false);
    
    return BMSStatus::OK; 
}
