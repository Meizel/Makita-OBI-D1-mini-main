# Opstartsamenvatting

Doel bereikt! De ESP8266 draait nu met de firmware en webinterface op **versie 1.3**.

![Hoofdinterface](img/Health_Balancing)

## Bereikte resultaten

- **Basisproject**: Volledige refactoring van de Makita BMS-reader voor ESP8266, gebaseerd op het oorspronkelijke project van Belik1982.
- **Succesvolle upload**: CH340-driverfout opgelost en uploadsnelheid geoptimaliseerd.
- **Werkende webinterface**: Moderne interface met donkere modus, Engels als standaard, optioneel Nederlands en mobielvriendelijk ontwerp.
- **Wifi-stationmodus**: Verbinding met de werkplaatsrouter en eenvoudige toegang via **makita.local**.
- **Geschiedenisgrafieken**: Realtime visualisatie van de ontwikkeling van de celspanningen.
- **Dynamische HUD**: Slimme visuele indicator van de gezondheid van het accupakket (gebalanceerd/kritiek).
- **Ondersteuning voor BL14 (14,4V)**: Automatische detectie en dynamische weergave voor 4-cel accuâ€™s.
- **Vernieuwde OTA**: Nieuwe premium interface voor firmware-updates met een gedetailleerde voortgangsbalk.
- **GitHub-synchronisatie**: Professionele repository met volledige documentatie en geoptimaliseerde bestanden.

## Projectgalerij

````carousel
![Accupakket- en celstatus](img/Battery_Status)
<!-- slide -->
![Realtime geschiedenisgrafiek](img/History_Graph)
<!-- slide -->
![Systeemconfiguratie en OTA](img/Firmware_OTA_WiFi)
````

## Nieuwe functies gebruiken

### 1. Fysieke wijziging (kritiek)

De **EN**-draad van de accu moet worden aangesloten op **D5** met een 4,7k pull-up naar 3,3V.

### 2. Toegang via mDNS

Je hoeft het IP-adres niet meer op te zoeken. Verbind simpelweg met de wifi en ga naar:
**`http://makita.local`**

### 3. Celdiagnose

Gebruik de geschiedenisgrafiek om cellen te detecteren waarvan de spanning onder belasting sneller daalt. Als de **dynamische HUD** rood wordt, heeft het accupakket balancering of reparatie nodig.

## De tool gebruiken

1. **Toegang**: Verbind met het wifi-netwerk `Makita_OBI_ESP8266`.
2. **Browser**: Ga naar `http://makita.local`.
3. **Uitlezen**: Sluit een Makita-accu aan en klik op â€œInfo uitlezenâ€.

## Laatste technische opmerkingen

- **Versie**: 1.3
- **Enable-pin**: D5
- **OneWire-pin**: D4
- **SeriÃ«le snelheid**: 115200 baud

---
Gegenereerd door Makita OBI ESP8266 â€¢ Eindversie


