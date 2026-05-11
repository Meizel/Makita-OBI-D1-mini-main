# Handleiding uploaden naar ESP8266

Dit project gebruikt **PlatformIO**. Om alles correct te laten werken, moet je twee verschillende uploads uitvoeren: de **firmware** (C++-code) en het **bestandssysteem** (HTML/CSS/JS-bestanden in de map `/data`).

## 1. Firmware uploaden (code)

Hiermee compileer en upload je het bestand `main.cpp` en de benodigde bibliotheken.

- **In VS Code (interface):**
    1. Klik op het **PlatformIO**-icoon (het mier-icoon) in de linker zijbalk.
    2. Zoek in het menu `Project Tasks` naar `d1_mini`.
    3. Selecteer **General** -> **Upload**.

- **Via de command line (CLI):**

    ```powershell
    pio run --target upload
    ```

## 2. Bestandssysteem uploaden (LittleFS)

**BELANGRIJK!** Als je deze stap overslaat, wordt de webinterface niet geladen omdat de ESP8266 het bestand `index.html` niet kan vinden.

- **In VS Code (interface):**
    1. Ga naar het **PlatformIO**-icoon -> `Project Tasks` -> `d1_mini`.
    2. Zoek de sectie **Platform**.
    3. Klik op **Upload Filesystem Image**.

- **Via de command line (CLI):**

    ```powershell
    pio run --target uploadfs
    ```

## 3. Monitoren

Om debugberichten te bekijken, zoals het IP-adres dat aan de ESP8266 is toegewezen:

- Klik op het â€œstekkerâ€-icoon in de onderste balk van VS Code, of:
- Ga naar **PlatformIO** -> `Project Tasks` -> **Monitor**.

---

### Aanvullende opmerkingen

- Zorg ervoor dat je ESP8266 via USB is aangesloten.
- Als de upload mislukt, probeer dan de **FLASH**-knop op de D1 mini/ESP8266 ingedrukt te houden op het moment dat "Connecting..." in de terminal verschijnt.
- De poort en snelheid zijn geconfigureerd in het bestand [platformio.ini](file:///d:/GITHUB/Makita-OBI-ESP8266/platformio.ini).


