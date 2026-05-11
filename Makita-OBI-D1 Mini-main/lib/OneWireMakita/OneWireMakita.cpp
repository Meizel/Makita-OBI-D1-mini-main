// lib/OneWireMakita/OneWireMakita.cpp - ESP8266 LOW-LEVEL IMPLEMENTATION

#include "OneWireMakita.h"

/**
 * Constructor for the OneWireMakita class.
 * The pin is configured as OUTPUT_OPEN_DRAIN to allow bidirectional communication
 * without short-circuit risk. The line is pulled high using a pull-up resistor.
 */
OneWireMakita::OneWireMakita(uint8_t pin) : _pin(pin) {
    pinMode(_pin, INPUT_PULLUP);
    pinMode(_pin, OUTPUT_OPEN_DRAIN); 
    digitalWrite(_pin, HIGH); 
}

/**
 * Implements the bus reset sequence.
 */
bool OneWireMakita::reset(void) {
    // 1. Idle bus verification. The bus must be HIGH due to the pull-up.
    pinMode(_pin, INPUT_PULLUP);
    if (digitalRead(_pin) == LOW) {
        // The bus is shorted to ground, or the pin is floating without an effective pull-up.
        return false; 
    }
    
    pinMode(_pin, OUTPUT_OPEN_DRAIN);
    
    noInterrupts();
    digitalWrite(_pin, LOW); 
    interrupts();

    delayMicroseconds(TIME_RESET_PULSE); 

    noInterrupts();
    digitalWrite(_pin, HIGH);           // Release the bus
    delayMicroseconds(TIME_RESET_WAIT);  
    bool presence = !digitalRead(_pin);  // Read the presence pulse
    interrupts();

    delayMicroseconds(TIME_RESET_SLOT); 
    
    // 2. Recovery verification: the bus MUST return to HIGH.
    // If it stays LOW after the slot, this is a false positive caused by a floating pin.
    if (digitalRead(_pin) == LOW) {
        presence = false; 
    }

    return presence;
}

/**
 * Sends a full byte while handling the critical timing of each bit.
 */
void OneWireMakita::write(uint8_t v) {
    for (uint8_t bitMask = 0x01; bitMask; bitMask <<= 1) {
        if (bitMask & v) { // Write a logical '1'
            noInterrupts();
            digitalWrite(_pin, LOW); 
            delayMicroseconds(TIME_WRITE1_LOW); // Short pulse
            digitalWrite(_pin, HIGH);
            interrupts();
            delayMicroseconds(TIME_WRITE1_HIGH);
        } else { // Write a logical '0'
            noInterrupts();
            digitalWrite(_pin, LOW); 
            delayMicroseconds(TIME_WRITE0_LOW); // Long pulse
            digitalWrite(_pin, HIGH);
            interrupts();
            delayMicroseconds(TIME_WRITE0_HIGH);
        }
    }
}

/**
 * Reads a full byte from the bus by sampling shortly after the start pulse.
 */
uint8_t OneWireMakita::read() {
    uint8_t result = 0;
    for (uint8_t bitMask = 0x01; bitMask; bitMask <<= 1) {
        noInterrupts();
        digitalWrite(_pin, LOW); 
        delayMicroseconds(TIME_READ_PULSE); // Generate the read start pulse
        digitalWrite(_pin, HIGH); 
        delayMicroseconds(TIME_READ_SAMPLE); // Wait for the BMS to set the data level
        if (digitalRead(_pin)) {
            result |= bitMask; // Bus is HIGH, so the bit is '1'
        }
        interrupts();
        delayMicroseconds(TIME_READ_SLOT); // Complete the bit time slot
    }
    return result;
}
