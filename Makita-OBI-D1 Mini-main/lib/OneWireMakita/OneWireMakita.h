// lib/OneWireMakita/OneWireMakita.h - PHYSICAL ABSTRACTION LAYER

#ifndef OneWireMakita_h
#define OneWireMakita_h

#include <Arduino.h>

#if defined(ESP8266)
  typedef uint8_t gpio_num_t;
#endif
/**
 * Class implementing the OneWire protocol.
 * This implementation has been adapted specifically for the timing and logic levels
 * used by Makita batteries.
 */
class OneWireMakita
{
  public:
    // --- Timing constants in microseconds ---
    // These constants define the physical bus timing so the BMS can recognize the signal.
    
    // Reset cycle timing
    static constexpr uint16_t TIME_RESET_PULSE = 750; // LOW pulse used to reset slave devices
    static constexpr uint16_t TIME_RESET_WAIT  = 70;  // Wait before reading presence
    static constexpr uint16_t TIME_RESET_SLOT  = 410; // Time to complete the reset slot
    
    // Bit write timing
    static constexpr uint16_t TIME_WRITE1_LOW  = 12;  // Short pulse for a logical '1'
    static constexpr uint16_t TIME_WRITE1_HIGH = 120; // Recovery time after a '1'
    static constexpr uint16_t TIME_WRITE0_LOW  = 100; // Long pulse for a logical '0'
    static constexpr uint16_t TIME_WRITE0_HIGH = 30;  // Recovery time after a '0'
    
    // Bit read timing
    static constexpr uint16_t TIME_READ_PULSE  = 10;  // Read start pulse
    static constexpr uint16_t TIME_READ_SAMPLE = 10;  // Wait before sampling the bit
    static constexpr uint16_t TIME_READ_SLOT   = 53;  // Time to complete the read slot

    /**
     * Constructor: initializes the bus on the selected pin.
     */
    OneWireMakita(uint8_t pin);
    
    /**
     * Performs a reset pulse and checks whether a battery is present.
     * @return true if a BMS response is detected.
     */
    bool reset(void);

    /**
     * Sends a full byte to the bus, one bit at a time.
     */
    void write(uint8_t v);

    /**
     * Reads a full byte from the bus, one bit at a time.
     */
    uint8_t read(void);

  private:
    gpio_num_t _pin; // Physical pin configured in Open-Drain mode
};

#endif
