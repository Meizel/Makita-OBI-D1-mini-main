# Montagehandleiding - Het apparaat bouwen

Volg deze stappen om je eigen **Makita OBI ESP8266** diagnoseapparaat te bouwen.

## Fase 1: Hardwarevoorbereiding

### 1. De accuconnector voorbereiden

- Je hebt drie contacten nodig: **B-** (massa), **DATA** en **EN**. Sluit **B+** niet rechtstreeks aan op de ESP8266.

### 2. Printplaat monteren

- Verbind de **GND** van de ESP8266 met **B-** van de accu.
- Verbind **D4** met de **DATA**-pin van de accu.
- **Pull-up**: plaats een 4,7k weerstand tussen **D4** en **3,3V**.

### 3. Inschakelcircuit

- Verbind **D5** met de **EN**-pin van de accu.
- **Pull-up**: plaats een 4,7k weerstand tussen **D5** en **3,3V**.
- Gebruik hiervoor geen transistor en sluit de accu-**B+** niet aan op de ESP8266.

## Fase 2: Softwareconfiguratie

### 1. Firmware uploaden

- Open het project in **PlatformIO** en klik op **Upload**.

### 2. Webinterface uploaden (LittleFS)

- Zoek de optie **Upload Filesystem Image** in het PlatformIO-menu. Deze stap is verplicht!

## Fase 3: Eindtest

1. Sluit de ESP8266 aan via USB of op een 5V-voeding.
2. Zoek naar het wifi-netwerk `Makita_OBI_ESP8266`.
3. Ga naar `http://makita.local` of `http://192.168.4.1`.
4. Sluit een accu aan en klik op **Info uitlezen**.

> [!TIP]
> Als je de ESP8266 rechtstreeks vanuit de 18V Makita-accu wilt voeden, gebruik dan altijd een 5V **buck-converter**.


