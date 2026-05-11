// src/MakitaBMS.h - OPTIMIZED AND DOCUMENTED VERSION

#ifndef MAKITA_BMS_H
#define MAKITA_BMS_H

#include <Arduino.h>
#include <functional>
#include "OneWireMakita.h"

// --- Enumerations and types ---

// Log levels for flexible debugging
enum LogLevel { 
    LOG_LEVEL_NONE,  // Do not show any debug messages
    LOG_LEVEL_INFO,  // Show only main events and critical errors
    LOG_LEVEL_DEBUG  // Detailed output with hexadecimal data dumps (HEX dumps)
};

// BMS operation states and error codes
enum class BMSStatus {
    OK,                        // Operation completed successfully
    ERROR_NOT_PRESENT,         // Battery does not respond to the presence pulse
    ERROR_NOT_IDENTIFIED,      // An action was attempted before reading the static data first
    ERROR_MODEL_NOT_SUPPORTED, // A battery was detected, but its protocol is unknown
    ERROR_COMMUNICATION,       // Data-bus integrity or timing failure
    ERROR_NOT_AVAILABLE        // The requested function is not available for this battery model
};

// Helper function to convert the internal status to a user-readable message
String statusToString(BMSStatus status, const String& lang);

// Callback used to redirect logs (for example, to Serial or WebSocket)
using LogCallback = std::function<void(const String&, LogLevel)>;

// --- Data structures ---

// Structure used to store the cleaned technical battery information
struct BatteryData {
    String model = "N/A";           // Model name (e.g. BL1830)
    int charge_cycles = 0;          // Total charge-cycle counter
    String lock_status = "N/A";     // Controller lock status
    String status_code = "00";      // Internal status code in HEX
    float pack_voltage = 0.0;       // Total summed pack voltage (V)
    int cell_count = 5;             // Number of cells in series (5 for 18V, 4 for 14.4V)
    float cell_voltages[5] = {0.0}; // Individual voltage of each of the 5 cells
    float cell_diff = 0.0;          // Maximum difference between the highest and lowest cell
    float temp1 = 0.0, temp2 = 0.0; // Temperatures measured by the internal sensors (°C)
    String mfg_date = "N/A";        // Formatted manufacturing date
    String capacity = "N/A";        // Nominal capacity (e.g. 5.0Ah)
    String battery_type = "";       // Chemistry/generation type identifier
    String rom_id = "";             // 8-byte ROM identifier of the BMS
};

// Structure used to track which commands are supported by the detected model
struct SupportedFeatures {
    bool read_dynamic = false; // Supports reading cell voltages?
    bool led_test = false;     // Supports manual LED control?
    bool clear_errors = false; // Supports clearing errors/locks?
};

// --- Main controller class ---

/**
 * Class that encapsulates all low-level protocol logic used to interact
 * with the different Makita battery management systems (BMS).
 */
class MakitaBMS {
public:
    // Constant Makita protocol commands (defined in HEX)
    static constexpr byte CMD_READ_STATIC[]     = {0xAA, 0x00}; // Read master data table
    static constexpr byte CMD_READ_DYNAMIC[]    = {0xD7, 0x00, 0x00, 0xFF}; // Read voltages/temperature
    static constexpr byte CMD_LED_TEST_INIT[]   = {0xD9, 0x96, 0xA5}; // Start LED test mode
    static constexpr byte CMD_LED_ON[]          = {0xDA, 0x31}; // Turn LEDs on
    static constexpr byte CMD_LED_OFF[]         = {0xDA, 0x34}; // Turn LEDs off
    static constexpr byte CMD_CLEAR_ERR_INIT[]  = {0xD9, 0x96, 0xA5}; // Start error reset
    static constexpr byte CMD_CLEAR_ERR_EXEC[]  = {0xDA, 0x04}; // Execute clear operation
    static constexpr byte CMD_GET_MODEL[]       = {0xDC, 0x0C}; // Query model name

    /**
     * @param onewire_pin GPIO pin used for data
     * @param enable_pin GPIO pin connected to the battery EN line
     */
    MakitaBMS(uint8_t onewire_pin, uint8_t enable_pin);
    
    // Event logging system configuration
    void setLogCallback(LogCallback callback);
    void setLogLevel(LogLevel level);

    // Main operations
    bool isPresent(); // Checks for a physical connection
    BMSStatus readStaticData(BatteryData &data, SupportedFeatures &features); // Identifies the model
    BMSStatus readDynamicData(BatteryData &data); // Reads voltages in real time
    BMSStatus ledTest(bool on); // Visual LED test
    BMSStatus clearErrors();    // Attempts to restore "dead" batteries (compatible models only)

private:
    OneWireMakita makita; // Physical bus abstraction layer
    uint8_t _enable_pin;   // Battery EN pin
    
    // Detected controller types
    enum class ControllerType { UNKNOWN, STANDARD, F0513 } _controller = ControllerType::UNKNOWN;
    bool _is_identified = false; // Flag used to enforce the correct command flow
    
    LogCallback _log;
    LogLevel _logLevel = LOG_LEVEL_DEBUG;
    
    // Internal bus communication functions
    void cmd_and_read_33(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len);
    void cmd_and_read_cc(const byte* cmd, uint8_t cmd_len, byte* rsp, uint8_t rsp_len);
    void setEnable(bool enabled);
    
    // Utility used to correct the bit/nibble order in some fields
    byte nibble_swap(byte b) { return (b >> 4) | (b << 4); }
    
    // Hardware-type-specific identification methods
    String getModel();
    String getF0513Model();

    // Internal log handling and data dump management
    void logger(const String& message, LogLevel level); 
    void log_hex(const String& prefix, const byte* data, int len);
};

#endif
