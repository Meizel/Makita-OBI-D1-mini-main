# Assembly Guide - Building the Device

Follow these steps to build your own **Makita OBI ESP8266** diagnostic tool.

## Phase 1: Hardware Preparation

### 1. Prepare the Battery Connector

- You need three contacts: **V+** (Positive), **V-** (Negative), and the **Data Pin** (small center one).

### 2. Board Assembly

- Connect the ESP8266's **GND** to the negative rail (V-).
- Connect **D4** to the battery **DATA** pin.
- **Pull-up**: Place a 4.7k resistor between **D4** and the ESP8266's **3.3V** pin.

### 3. Enable Circuit

- Connect **D5** to the battery **EN** pin.
- **Pull-up**: Place a 4.7k resistor between **D5** and the ESP8266's **3.3V** pin.
- Do not connect the battery **B+** terminal directly to the ESP8266.

## Phase 2: Software Configuration

### 1. Firmware Upload

- Open the project in **PlatformIO** and click **Upload**.

### 2. Web Interface Upload (LittleFS)

- Find the **Upload Filesystem Image** option in the PlatformIO menu. This step is mandatory!

## Phase 3: Final Testing

1. Connect the ESP8266 to USB or a 5V power source.
2. Look for the `Makita_OBI_ESP8266` WiFi network.
3. Go to `http://makita.local` or `http://192.168.4.1`.
4. Connect a battery and click "Read Info".

> [!TIP]
> If you are going to power the ESP8266 directly from the Makita battery's 18V, always use a 5V **Buck Converter**.

