# Pinout-rapport - Makita OBI ESP8266

Samenvatting van de ESP8266-pinindeling voor dit project.

| D1 mini pin | Functie | Beschrijving |
| :--- | :--- | :--- |
| **D4** | **DATA (OneWire)** | Communicatie met pin 2 / DATA van de accu. |
| **D5** | **EN** | Enable-lijn naar pin 6 / EN van de accu, actief hoog. |
| **GPIO 1 (TX0)** | **DEBUG (serieel)** | SeriÃ«le loguitvoer. |
| **GPIO 3 (RX0)** | **DEBUG (serieel)** | SeriÃ«le data-invoer. |

## Hardware-opmerkingen

- **D1 mini mapping**: **D4 = GPIO2** en **D5 = GPIO14**.
- **ENABLE/EN**: De EN-draad van de accu moet op **D5** worden aangesloten met een 4,7k pull-up naar 3,3V.
- **ONEWIRE/DATA**: De datadraad van de accu moet op **D4** worden aangesloten met een 4,7k pull-up naar 3,3V.

---
Configuratie geoptimaliseerd voor versie 1.3


