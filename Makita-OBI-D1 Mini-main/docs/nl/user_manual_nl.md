# Gebruikershandleiding - Systeembediening

Welkom bij de **Makita OBI ESP8266** diagnosetool. Deze handleiding legt uit hoe je de interface optimaal gebruikt.

## 1. Eerste verbinding

1. Sluit het apparaat aan op de accu of op een voeding.
2. Verbind met je smartphone of pc met het wifi-netwerk: **`Makita_OBI_ESP8266`**.
3. Open je browser en ga naar: **`http://makita.local`** of **`http://192.168.4.1`**.

## 2. Gegevens uitlezen

- **Knop â€œInfo uitlezenâ€**: Voert een volledige uitlezing van de accu uit, inclusief model, laadcycli, vergrendelstatus en beginspanningen.
- **Knop â€œSpanningen uitlezenâ€**: Werkt alleen de celspanningen bij. Handig voor snel gebruik.
- **Knop â€œFouten resettenâ€**: Probeert permanente fouten te wissen en de controller te ontgrendelen.
- **Automatisch uitlezen**: Als je de schakelaar â€œRealtime updatesâ€ activeert, vernieuwt het systeem de gegevens automatisch elke 3 seconden.
- **Onbalans-HUD**: In de header zie je een badge die aangeeft of het accupakket **gebalanceerd**, **ongebalanceerd** of **kritiek** is.

## 3. Geschiedenisgrafieken

- Onder de celstatus zie je een realtime grafiek.
- Elke lijn stelt Ã©Ã©n cel voor (1 tot 5). Bij BL14-accuâ€™s worden automatisch alleen 4 lijnen weergegeven.
- Deze grafiek is handig om te zien of de spanning van een cel sneller daalt dan de andere cellen wanneer de accu belast wordt.

## 4. Wifi-configuratie (werkplaatsmodus)

Om het apparaat met je normale wifi-netwerk te verbinden:

1. Klik op het tandwielicoon (**âš™ï¸**).
2. Vul in de sectie â€œWifi-configuratieâ€ de **SSID** (netwerknaam) en het **wachtwoord** in.
3. Klik op â€œVerbinden met wifiâ€.
4. De ESP8266 start opnieuw op. Daarna kun je hem vanaf elk apparaat op je lokale netwerk bereiken via **`http://makita.local`**.

## 5. Interpretatie van accugezondheid (SOH)

- **Uitstekend**: Nieuwe accu of accu met zeer weinig gebruik.
- **Redelijk**: Normaal gebruikt, met iets verminderde capaciteit.
- **Verslechterd**: Een balanceercyclus wordt aanbevolen, of controleer de individuele cellen.
- **Vergrendeld**: De BMS heeft een kritieke fout gedetecteerd en de accu vergrendeld.

## 6. Problemen oplossen

| Probleem | Waarschijnlijke oorzaak | Oplossing |
| :--- | :--- | :--- |
| Wifi verschijnt niet | Pin kortgesloten of boot-pin conflict. | Controleer of DATA op D4 zit, EN op D5 zit, en beide een 4,7k pull-up naar 3,3V hebben. |
| â€œ(Geen accu aanwezig)â€ verschijnt | Slechte fysieke verbinding. | Controleer of de datadraad goed contact maakt met de middelste pin. |
| Webpagina laadt niet | Bestandssysteem ontbreekt. | Voer â€œUpload Filesystem Imageâ€ uit vanuit PlatformIO. |
| Spanningen staan op 0,00V | Accu slaapt of cel bestaat niet. | Klik op â€œInfo uitlezenâ€. Bij BL14 is de 5e cel altijd leeg. |

---
Gegenereerd door Makita OBI ESP8266 â€¢ Versie 1.3


