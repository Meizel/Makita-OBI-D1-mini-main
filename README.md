# Makita OBI ESP8266

Advanced diagnostic tool for Makita LXT 18V (BL18) and 14.4V (BL14) batteries based on ESP8266.

## Version 1.4 Features

- **Triple Presence Verification**: Elimination of false positives (ghost batteries).
- **Dual WiFi and mDNS**: Simultaneous access via AP/Station and user-friendly URL **<http://makita.local>**.
- **Real-Time Charts**: Cell-by-cell voltage history for fatigue diagnosis.
- **Dynamic HUD**: Intelligent visual pack health indicator (Balanced/Critical).
- **Balancing Assistant**: Precise instructions for balancing uncompensated packs.
- **Premium Web Interface**: With dark mode, English by default, optional Dutch, and Mobile-Friendly design.
- **Compatibility**: Designed to run on any ESP8266 (including D1 mini).

## Screenshots

| Main View | Health and Cells | Charts and History |
| :---: | :---: | :---: |
| ![Main](Makita-OBI-D1-mini-main/docs/img/Health_Balancing) | ![Details](Makita-OBI-D1-mini-main/docs/img/Battery_Status) | ![Graph](Makita-OBI-D1-mini-main/docs/img/History_Graph) |

> [!TIP]
> Access advanced settings and OTA updates from the gear icon âš™ï¸.

## Project Structure

- `/src`: Firmware source code (C++).
- `/data`: Web Interface (HTML/JS/CSS).
- `/lib`: Custom libraries for the Makita OneWire protocol.
- `/docs`: Technical documentation, user manuals, and electrical schematics.

## Hardware Requirements

- **ESP8266 D1 mini**.
- 4.7kÎ© pull-up resistor from **D4 / DATA** to **3.3V**.
- 4.7kÎ© pull-up resistor from **D5 / EN** to **3.3V**.
- Direct connections to Makita **DATA**, **EN**, and **B- / GND**. Do not connect battery **B+** to the ESP8266.
- [View Electrical Schematic](./docs/en/electrical_schematic.md)

## Quick Setup

1. Open the project in **VS Code** with **PlatformIO**.
2. Connect your ESP8266.
3. Run **Upload** (Firmware).
4. Run **Upload Filesystem Image** (Web Interface).

## Version History (Changelog)

- **v1.3** (Current):
  - Added support for battery models **BL1460A**, **BL1850B-D**, and BMS boards with STM32/RL78 microcontrollers (**LIPW014**, **LIPW015**, **LIPW017**).
  - Documentation updated for D1 mini pins **D4/D5** and direct DATA/EN pull-ups.
- **v1.2**:
  - Implemented automatic support and dynamic rendering for **Makita BL14** batteries (14.4V - 4 cells).
- **v1.1**:
  - Added **mDNS** connection support (`http://makita.local`).
  - **Dynamic HUD** for status and **offline** history chart (local Chart.js imported).
  - New premium interface for OTA updates and UI/UX improvements.
- **v1.0**:
  - Initial stable release (Refactored for ESP8266 based on Belik1982's project).

## License and Usage

This project is based on the original work by **Belik1982** (<https://github.com/Belik1982/esp8266-makita-bms-reader>).

- **License**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Attribution-NonCommercial-ShareAlike).
- **Commercial Use**: The sale of this software or devices incorporating it is strictly prohibited without explicit authorization.
- **Credits**: Reference to the original authors must always be maintained.

---
*Developed for the community of tool and electronics enthusiasts.*


