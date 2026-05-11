# Pinout Report - Makita OBI ESP8266

Summary of the ESP8266 pin assignment for this project.

| D1 mini pin | Function | Description |
| :--- | :--- | :--- |
| **D4** | **DATA (OneWire)** | Communication with battery pin 2 / DATA. |
| **D5** | **EN** | Enable line to battery pin 6 / EN, active high. |
| **GPIO 1 (TX0)** | **DEBUG (Serial)** | Serial port log output. |
| **GPIO 3 (RX0)** | **DEBUG (Serial)** | Serial data input. |

## Hardware Notes

- **D1 mini mapping**: **D4 = GPIO2** and **D5 = GPIO14**.
- **ENABLE/EN**: The battery EN wire must be connected to **D5** with a 4.7k pull-up to 3.3V.
- **ONEWIRE/DATA**: The battery DATA wire must be connected to **D4** with a 4.7k pull-up to 3.3V.

---
Configuration optimized for Version 1.3

