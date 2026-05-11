// data/app.js - WEB INTERFACE LOGIC (NL / EN)

// --- Makita model database (nominal values) ---
const MAKITA_MODELS = {
  "BL1815": { cap: "1.5Ah", cells: "5x 18650", config: "5S1P", v_nom: "18V" },
  "BL1815N": { cap: "1.5Ah", cells: "5x 18650", config: "5S1P", v_nom: "18V" },
  "BL1820": { cap: "2.0Ah", cells: "5x 18650", config: "5S1P", v_nom: "18V" },
  "BL1830": { cap: "3.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "BL1840": { cap: "4.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "BL1850": { cap: "5.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "BL1850B": { cap: "5.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "BL1860B": { cap: "6.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "BL1415": { cap: "1.5Ah", cells: "4x 18650", config: "4S1P", v_nom: "14.4V" },
  "BL1430": { cap: "3.0Ah", cells: "8x 18650", config: "4S2P", v_nom: "14.4V" },
  "BL1440": { cap: "4.0Ah", cells: "8x 18650", config: "4S2P", v_nom: "14.4V" },
  "BL1450": { cap: "5.0Ah", cells: "8x 18650", config: "4S2P", v_nom: "14.4V" },
  "BL1460": { cap: "6.0Ah", cells: "8x 18650", config: "4S2P", v_nom: "14.4V" },
  "BL1460A": { cap: "6.0Ah", cells: "8x 18650", config: "4S2P", v_nom: "14.4V" },
  "BL1850B-D": { cap: "5.0Ah", cells: "10x 18650", config: "5S2P", v_nom: "18V" },
  "LIPW014": { cap: "N/A", cells: "Unknown", config: "5S", v_nom: "18V" },
  "LIPW015": { cap: "N/A", cells: "Unknown", config: "5S", v_nom: "18V" },
  "LIPW017": { cap: "N/A", cells: "Unknown", config: "5S", v_nom: "18V" }
};

// --- Languages ---
const SUPPORTED_LANGS = ['en', 'nl'];
const DEFAULT_LANG = 'en';
const LANG_DEFAULT_VERSION = 'en-default-1';

// --- Translations (NL, EN) ---
const TRANSLATIONS = {
  nl: {
    subtitle: "Accudiagnose",
    sectionTitle: "Bediening",
    section_overview: "Overzicht accupakket",
    rawTitle: "Systeemconsole",
    footerText: "Versie 1.4 • Makita OBI • D1 mini",
    btn_read: "Info uitlezen",
    btn_dynamic: "Spanningen uitlezen",
    btn_clear_err: "Fouten resetten",
    btn_led_test: "LED testen",
    msg_wait: "Even geduld...",
    cell: "Cel",
    status_connecting: "Verbinden...",
    status_online: "Systeem online",
    status_offline: "Offline",
    locked: "VERGRENDELD",
    unlocked: "ONTGRENDELD",
    model: "Model",
    cycles: "Laadcycli",
    state: "Status",
    mfg_date: "Productiedatum",
    capacity: "Capaciteit",
    rom_id: "ROM-ID",
    status_sim: "SIMULATIEMODUS (geen hardware)",
    sum_total: "Totale spanning",
    sum_diff: "Verschil",
    log_waiting: "Wachten op verbinding...",
    log_req_static: "Mastergegevens opvragen...",
    log_req_dynamic: "Spanningen bijwerken...",
    log_clear_confirm: "BMS-fouten wissen?",
    log_sim_local: "Lokale omgeving gedetecteerd (FILE://). Simulatiemodus inschakelen...",
    log_sim_fail: "Kan geen verbinding maken met de hardware. Simulatiemodus inschakelen...",
    log_sim_exc: "Fout tijdens verbinden. Simulatiemodus inschakelen...",
    log_ws_error: "WebSocket-verbindingsfout.",
    log_sim_recv: "Opdracht ontvangen: ",
    log_sim_success: "Gesimuleerde actie succesvol uitgevoerd.",
    log_evt_config: "Event-handlers configureren...",
    log_lang_changed: "Taal gewijzigd naar {lang}",
    log_chart_missing: "Chart.js is niet geladen. Controleer chart.min.js",
    log_chart_ready: "Geschiedenisgrafiek geinitialiseerd.",
    log_chart_error: "Fout bij initialiseren grafiek: {error}",
    log_invalid_json: "Ongeldig JSON-bericht ontvangen: {error}",
    lbl_auto: "Realtime updates",
    lbl_temp: "Temperaturen",
    lbl_fatigue: "Chemische slijtage",
    lbl_imbalance: "Cel-onbalans (HUD)",
    lbl_report: "Rapport exporteren",
    health_good: "Uitstekend",
    health_fair: "Redelijk",
    health_poor: "Verslechterd",
    health_dead: "Versleten",
    fatigue_low: "Laag (nieuw)",
    fatigue_med: "Gemiddeld (gebruikt)",
    fatigue_high: "Hoog (slijtage)",
    report_title: "TECHNISCH ACCURAPPORT",
    report_date: "DATUM",
    report_model: "MODEL",
    report_rom_id: "ROM-ID",
    report_state: "STATUS",
    report_cell_diag: "CELDIAGNOSE",
    report_total_voltage: "TOTALE SPANNING",
    report_imbalance: "ONBALANS",
    report_cycles: "LAADCYCLI",
    report_soh: "STATUS ACCUGEZONDHEID (SOH)",
    report_temps: "TEMPERATUREN",
    report_generated_by: "Gegenereerd door Makita OBI D1 mini",
    report_generated_success: "Rapport succesvol gegenereerd.",
    report_file_prefix: "Rapport_Makita",
    lbl_balance_title: "Handmatige balanceerassistent",
    lbl_model_compare: "Modelvergelijking (nominaal)",
    lbl_nominal_cap: "Nominale capaciteit:",
    lbl_config: "Configuratie:",
    lbl_cells: "Cellen:",
    lbl_current_state: "Huidige status:",
    lbl_imbalance_detected: "Onbalans gedetecteerd:",
    lbl_action_charge: "Laden",
    lbl_action_discharge: "Ontladen",
    lbl_soh: "SOH (accugezondheid)",
    lbl_history: "Realtime geschiedenisgrafiek",
    lbl_system_title: "Systeem- & firmware-update",
    lbl_wifi_config: "Wifi-configuratie (stationmodus)",
    lbl_wifi_ssid: "Netwerknaam (SSID)",
    lbl_wifi_pass: "Wachtwoord",
    btn_save_wifi: "Verbinden met wifi",
    lbl_wifi_hint: "De D1 mini start opnieuw op om verbinding te maken. De Makita AP blijft als back-up beschikbaar.",
    wifi_ssid_missing: "Voer een netwerknaam (SSID) in",
    wifi_confirm: "Wifi configureren en opnieuw opstarten?\nNetwerk: {ssid}",
    msg_presence_detected: " (accu gedetecteerd)",
    msg_presence_empty: " (geen accu aanwezig)",
    lbl_total_voltage: "Accupakketspanning",
    bal_ok: "Gebalanceerd",
    bal_warn: "Ongebalanceerd",
    bal_crit: "Kritiek",
    ota_title: "Firmware-update",
    ota_desc: "Houd je apparaat up-to-date met de nieuwste versie (.bin).",
    btn_ota_select: "Bestand selecteren",
    ota_msg_uploading: "Uploaden...",
    ota_confirm: "Wil je de firmware van de D1 mini bijwerken?",
    ota_success_log: "Update succesvol. Opnieuw opstarten...",
    ota_success_note: "Update succesvol! Opnieuw opstarten...",
    ota_fail_log: "Fout tijdens de update.",
    ota_fail_note: "Update mislukt"
  },

  en: {
    subtitle: "Battery diagnostics",
    sectionTitle: "Operations",
    section_overview: "Pack overview",
    rawTitle: "System console",
    footerText: "Version 1.4 • Makita OBI • D1 mini",
    btn_read: "Read info",
    btn_dynamic: "Read voltages",
    btn_clear_err: "Reset errors",
    btn_led_test: "Test LED",
    msg_wait: "Please wait...",
    cell: "Cell",
    status_connecting: "Connecting...",
    status_online: "System online",
    status_offline: "Offline",
    locked: "LOCKED",
    unlocked: "UNLOCKED",
    model: "Model",
    cycles: "Charge cycles",
    state: "Status",
    mfg_date: "Mfg date",
    capacity: "Capacity",
    rom_id: "ROM ID",
    status_sim: "SIMULATION MODE (no hardware)",
    sum_total: "Total voltage",
    sum_diff: "Difference",
    log_waiting: "Waiting for connection...",
    log_req_static: "Requesting master data...",
    log_req_dynamic: "Updating voltages...",
    log_clear_confirm: "Clear BMS errors?",
    log_sim_local: "Local environment detected (FILE://). Enabling simulation mode...",
    log_sim_fail: "Could not connect to hardware. Enabling simulation mode...",
    log_sim_exc: "Exception while connecting. Enabling simulation mode...",
    log_ws_error: "WebSocket connection error.",
    log_sim_recv: "Received command: ",
    log_sim_success: "Simulated operation completed successfully.",
    log_evt_config: "Configuring event handlers...",
    log_lang_changed: "Language changed to {lang}",
    log_chart_missing: "Chart.js not loaded. Check chart.min.js",
    log_chart_ready: "History chart initialized.",
    log_chart_error: "Error initializing chart: {error}",
    log_invalid_json: "Invalid JSON message received: {error}",
    lbl_auto: "Real-time updates",
    lbl_temp: "Temperatures",
    lbl_fatigue: "Chemical fatigue",
    lbl_imbalance: "Cell imbalance (HUD)",
    lbl_report: "Export report",
    health_good: "Excellent",
    health_fair: "Fair",
    health_poor: "Degraded",
    health_dead: "Worn out",
    fatigue_low: "Low (fresh)",
    fatigue_med: "Medium (used)",
    fatigue_high: "High (wear)",
    report_title: "BATTERY TECHNICAL REPORT",
    report_date: "DATE",
    report_model: "MODEL",
    report_rom_id: "ROM ID",
    report_state: "STATUS",
    report_cell_diag: "CELL DIAGNOSTICS",
    report_total_voltage: "TOTAL VOLTAGE",
    report_imbalance: "IMBALANCE",
    report_cycles: "CYCLES",
    report_soh: "STATE OF HEALTH (SOH)",
    report_temps: "TEMPERATURES",
    report_generated_by: "Generated by Makita OBI D1 mini",
    report_generated_success: "Report generated successfully.",
    report_file_prefix: "Makita_Report",
    lbl_balance_title: "Manual balancing assistant",
    lbl_model_compare: "Model comparison (nominal)",
    lbl_nominal_cap: "Nominal cap:",
    lbl_config: "Config:",
    lbl_cells: "Cells:",
    lbl_current_state: "Current state:",
    lbl_imbalance_detected: "Imbalance detected:",
    lbl_action_charge: "Charge",
    lbl_action_discharge: "Discharge",
    lbl_soh: "SOH (health)",
    lbl_history: "History graph (real-time)",
    lbl_system_title: "System & FW update",
    lbl_wifi_config: "WiFi configuration (station mode)",
    lbl_wifi_ssid: "Network name (SSID)",
    lbl_wifi_pass: "Password",
    btn_save_wifi: "Connect to WiFi",
    lbl_wifi_hint: "The D1 mini will restart to connect. It will keep the Makita AP as backup.",
    wifi_ssid_missing: "Enter a network name (SSID)",
    wifi_confirm: "Configure WiFi and restart?\nNetwork: {ssid}",
    msg_presence_detected: " (battery detected)",
    msg_presence_empty: " (empty bus)",
    lbl_total_voltage: "Pack voltage",
    bal_ok: "Balanced",
    bal_warn: "Imbalanced",
    bal_crit: "Critical",
    ota_title: "Firmware update",
    ota_desc: "Keep your device up to date with the latest version (.bin).",
    btn_ota_select: "Select file",
    ota_msg_uploading: "Uploading...",
    ota_confirm: "Update D1 mini firmware?",
    ota_success_log: "Update successful. Rebooting...",
    ota_success_note: "Success! Rebooting...",
    ota_fail_log: "Update failed.",
    ota_fail_note: "Update failed"
  }
};

// --- Simulation scenarios ---
const SIM_SCENARIOS = [
  {
    model: "BL1850B", cycles: 42, lock: "UNLOCKED", cap: "5.0Ah", date: "15/05/2023",
    volts: [4.01, 3.98, 3.95, 3.92, 3.99], diff: 0.12, pack: 19.85
  },
  {
    model: "BL1830", cycles: 120, lock: "UNLOCKED", cap: "3.0Ah", date: "10/01/2022",
    volts: [3.35, 3.32, 3.30, 3.34, 3.31], diff: 0.05, pack: 16.62
  },
  {
    model: "BL1850", cycles: 210, lock: "UNLOCKED", cap: "5.0Ah", date: "22/11/2021",
    volts: [4.05, 4.02, 3.15, 3.98, 4.01], diff: 0.90, pack: 19.21
  },
  {
    model: "BL1860B", cycles: 450, lock: "LOCKED", cap: "6.0Ah", date: "05/06/2020",
    volts: [3.85, 3.82, 3.79, 3.81, 3.84], diff: 0.06, pack: 19.11
  },
  {
    model: "BL1430", cycles: 85, lock: "UNLOCKED", cap: "3.0Ah", date: "12/03/2023",
    volts: [3.95, 3.92, 3.98, 3.91], diff: 0.07, pack: 15.76
  }
];

// --- Global variables ---
let storedLang = localStorage.getItem('makita_lang');
let currentLang = (
  localStorage.getItem('makita_lang_default_version') === LANG_DEFAULT_VERSION &&
  SUPPORTED_LANGS.includes(storedLang)
) ? storedLang : DEFAULT_LANG;
let socket;
let isConnected = false;
let isSimulation = false;
let lastData = null;
let lastPresence = false;
let pollInterval = null;
let historyChart = null;
let simScenario = 0;

const MAX_HISTORY = 40;

let historyData = {
  labels: [],
  datasets: [1, 2, 3, 4, 5].map(i => ({
    label: `Cell ${i}`,
    data: [],
    borderColor: `hsl(${i * 60}, 70%, 50%)`,
    backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.1)`,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
    fill: false
  }))
};

// --- Helpers ---
const el = id => document.getElementById(id);

const t = key => {
  const data = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG] || {};
  return data[key] || TRANSLATIONS[DEFAULT_LANG]?.[key] || key;
};

const tr = (key, vars = {}) => {
  let text = t(key);
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, value);
  });
  return text;
};

const savePref = (k, v) => localStorage.setItem(`makita_${k}`, v);

function getLocale() {
  if (currentLang === 'nl') return 'nl-NL';
  return 'en-GB';
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

function formatVoltage(value, decimals = 2) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(decimals)} V` : '-';
}

function isLockedStatus(value) {
  const raw = String(value || '').trim().toUpperCase();

  // Note: UNLOCKED contains LOCKED, so check unlocked variants first.
  // Therefore, check the unlocked variants first.
  if (
    raw.includes('UNLOCKED') ||
    raw.includes('ONTGRENDELD')
  ) {
    return false;
  }

  return (
    raw.includes('LOCKED') ||
    raw.includes('VERGRENDELD')
  );
}

function translatedLockStatus(value) {
  return isLockedStatus(value) ? t('locked') : t('unlocked');
}

function updateHistoryDatasets(cellCount) {
  if (historyData.datasets.length === cellCount) return;

  if (cellCount < historyData.datasets.length) {
    historyData.datasets = historyData.datasets.slice(0, cellCount);
  } else {
    for (let i = historyData.datasets.length; i < cellCount; i++) {
      historyData.datasets.push({
        label: `${t('cell')} ${i + 1}`,
        data: Array(historyData.labels.length).fill(null),
        borderColor: `hsl(${i * 60}, 70%, 50%)`,
        backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.1)`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false
      });
    }
  }

  if (historyChart) {
    historyChart.data.datasets = historyData.datasets;
    historyChart.update('none');
  }
}

/**
 * Application entry point.
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  setupEventListeners();
  connect();

  if (localStorage.getItem('makita_auto') === 'true') {
    const bAuto = el('checkAuto');
    if (bAuto) bAuto.checked = true;
  }

  initChart();
});

/**
 * Dark mode handling.
 */
function initTheme() {
  const isDark = localStorage.getItem('makita_theme') === 'dark';
  setTheme(isDark ? 'dark' : 'light');
}

function setTheme(theme, skipSync = false) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  const isDark = selectedTheme === 'dark';

  document.body.classList.toggle('dark-mode', isDark);
  savePref('theme', selectedTheme);

  const bLight = el('themeLight');
  const bDark = el('themeDark');
  if (bLight) bLight.classList.toggle('active', !isDark);
  if (bDark) bDark.classList.toggle('active', isDark);

  if (!skipSync && isConnected) {
    sendCommand('save_config', { lang: currentLang, theme: selectedTheme });
  }
}

/**
 * Initialize language settings.
 */
function initLang() {
  const hasCurrentDefault = localStorage.getItem('makita_lang_default_version') === LANG_DEFAULT_VERSION;

  if (!hasCurrentDefault || !SUPPORTED_LANGS.includes(currentLang)) {
    currentLang = DEFAULT_LANG;
    localStorage.setItem('makita_lang_default_version', LANG_DEFAULT_VERSION);
  }

  applyTranslations();
}

/**
 * Update all UI texts using data-i18n and data-i18n-hold attributes.
 */
function applyTranslations() {
  const data = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
  savePref('lang', currentLang);
  localStorage.setItem('makita_lang_default_version', LANG_DEFAULT_VERSION);
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(item => {
    const key = item.getAttribute('data-i18n');
    if (data[key]) item.textContent = data[key];
  });

  document.querySelectorAll('[data-i18n-hold]').forEach(item => {
    const key = item.getAttribute('data-i18n-hold');
    if (data[key]) item.placeholder = data[key];
  });

  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn${currentLang.toUpperCase()}`);
  });

  refreshStatus();

  if (historyChart) {
    historyChart.data.datasets.forEach((ds, i) => {
      ds.label = `${t('cell')} ${i + 1}`;
    });
    historyChart.update('none');
  }

  if (lastData) {
    renderStaticTable(lastData);
    renderCells(lastData);
  }
}

/**
 * Update the status bar.
 */
function refreshStatus() {
  const statusWidget = el('statusWidget');
  const statusText = el('statusText');
  if (!statusText || !statusWidget) return;

  if (isSimulation) {
    statusText.textContent = t('status_sim');
    statusWidget.style.background = '#fff3e0';
    statusText.style.color = '#e65100';
    return;
  }

  if (!isConnected) {
    statusText.textContent = t('status_offline');
    statusWidget.style.background = '#ffebee';
    statusText.style.color = '#c62828';
    return;
  }

  if (lastPresence || lastData) {
    statusText.textContent = t('status_online') + t('msg_presence_detected');
    statusWidget.style.background = '#e8f5e9';
    statusText.style.color = '#2e7d32';
  } else {
    statusText.textContent = t('status_online') + t('msg_presence_empty');
    statusWidget.style.background = '#fff3e0';
    statusText.style.color = '#e65100';
  }
}

/**
 * Initialize the Chart.js history graph.
 */
function initChart() {
  try {
    if (typeof Chart === 'undefined') {
      log(t('log_chart_missing'));
      return;
    }

    const canvas = el('historyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    historyChart = new Chart(ctx, {
      type: 'line',
      data: historyData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: { display: false },
          y: {
            min: 2.5,
            max: 4.3,
            ticks: { color: 'rgba(128,128,128,0.8)' },
            grid: { color: 'rgba(128,128,128,0.1)' }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 10,
              font: { size: 10 },
              color: 'rgba(128,128,128,0.8)'
            }
          }
        }
      }
    });

    historyChart.data.datasets.forEach((ds, i) => {
      ds.label = `${t('cell')} ${i + 1}`;
    });
    historyChart.update('none');

    log(t('log_chart_ready'));
  } catch (e) {
    log(tr('log_chart_error', { error: e.message }));
  }
}

function updateChart(cellVoltages) {
  if (!historyChart || !Array.isArray(cellVoltages)) return;

  if (historyData.labels.length >= MAX_HISTORY) {
    historyData.labels.shift();
    historyData.datasets.forEach(ds => ds.data.shift());
  }

  updateHistoryDatasets(cellVoltages.length);

  const now = new Date().toLocaleTimeString(getLocale());
  historyData.labels.push(now);

  cellVoltages.forEach((v, i) => {
    if (historyData.datasets[i]) {
      historyData.datasets[i].data.push(safeNumber(v));
    }
  });

  historyChart.update('none');
}

/**
 * WebSocket connection handling.
 */
function connect() {
  const statusText = el('statusText');
  if (statusText) statusText.textContent = t('status_connecting');

  if (window.location.protocol === 'file:') {
    log(t('log_sim_local'));
    enableSimulation();
    return;
  }

  try {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);

    socket.onopen = () => {
      isConnected = true;
      isSimulation = false;
      refreshStatus();
      sendCommand('presence');
      sendCommand('get_config');
    };

    socket.onclose = () => {
      isConnected = false;
      refreshStatus();

      setTimeout(() => {
        if (!isConnected && window.location.protocol === 'file:') {
          log(t('log_sim_fail'));
          enableSimulation();
        }
      }, 1500);
    };

    socket.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } catch (e) {
        log(tr('log_invalid_json', { error: e.message }));
      }
    };

    socket.onerror = () => {
      log(t('log_ws_error'));
    };
  } catch (e) {
    log(t('log_sim_exc'));
    enableSimulation();
  }
}

/**
 * Enable simulation mode.
 */
function enableSimulation() {
  isConnected = true;
  isSimulation = true;
  lastPresence = true;
  refreshStatus();
}

function simulateCommand(cmd) {
  log(t('log_sim_recv') + cmd);

  setTimeout(() => {
    if (cmd === 'presence') {
      handleMessage({ type: 'presence', present: true });
      return;
    }

    if (cmd === 'get_config') {
      handleMessage({ type: 'config', lang: currentLang, theme: localStorage.getItem('makita_theme') || 'light' });
      return;
    }

    if (cmd === 'save_config') {
      handleMessage({ type: 'success', message: t('log_sim_success') });
      return;
    }

    if (cmd === 'read_static') {
      const s = SIM_SCENARIOS[simScenario];
      handleMessage({
        type: 'static_data',
        features: { read_dynamic: true, led_test: true, clear_errors: true },
        data: {
          model: s.model,
          charge_cycles: s.cycles,
          lock_status: s.lock,
          capacity: s.cap,
          mfg_date: s.date,
          pack_voltage: s.pack,
          rom_id: "28 AF B1 04 00 00 00 E2",
          cell_voltages: s.volts,
          cell_diff: s.diff,
          temp1: 24.5 + (simScenario * 2),
          temp2: 25.1 + (simScenario * 2)
        }
      });
      simScenario = (simScenario + 1) % SIM_SCENARIOS.length;
      return;
    }

    if (cmd === 'read_dynamic') {
      const lastBase = SIM_SCENARIOS[(simScenario + SIM_SCENARIOS.length - 1) % SIM_SCENARIOS.length];
      const jitter = () => (Math.random() * 0.05) - 0.025;
      const newVolts = lastBase.volts.map(v => safeNumber(v) + jitter());

      handleMessage({
        type: 'dynamic_data',
        data: {
          pack_voltage: newVolts.reduce((a, b) => a + b, 0),
          cell_voltages: newVolts,
          cell_diff: Math.max(...newVolts) - Math.min(...newVolts),
          temp1: 25.4 + Math.random() * 5,
          temp2: 24.8 + Math.random() * 5
        }
      });
      return;
    }

    if (cmd === 'led_on' || cmd === 'led_off' || cmd === 'clear_errors' || cmd === 'set_wifi') {
      handleMessage({ type: 'success', message: t('log_sim_success') });
    }
  }, 300);
}

function handleMessage(msg) {
  if (msg.type === 'static_data') {
    lastData = msg.data;
    lastPresence = true;
    refreshStatus();
    renderStaticTable(msg.data);
    renderCells(msg.data);
    if (msg.features) updateButtonStates(msg.features);

    const overview = el('overviewCard');
    if (overview) overview.classList.remove('hidden');

    if (msg.data.cell_voltages) updateChart(msg.data.cell_voltages);
  } else if (msg.type === 'dynamic_data') {
    if (lastData) {
      Object.assign(lastData, msg.data);
      lastPresence = true;
      refreshStatus();
      renderCells(lastData);
      renderStaticTable(lastData);
      if (msg.data.cell_voltages) updateChart(msg.data.cell_voltages);
    }
  } else if (msg.type === 'presence') {
    updatePresence(Boolean(msg.present));
  } else if (msg.type === 'success' || msg.type === 'error') {
    showNotification(msg.message, msg.type === 'success' ? 'success' : 'danger');
  } else if (msg.type === 'debug') {
    log(msg.message);
  } else if (msg.type === 'config') {
    if (msg.lang && SUPPORTED_LANGS.includes(msg.lang) && msg.lang !== currentLang) {
      currentLang = msg.lang;
      applyTranslations();
    }

    if (msg.theme === 'dark' || msg.theme === 'light') {
      setTheme(msg.theme, true);
    }
  }
}

function sendCommand(cmd, params = {}) {
  if (!isConnected) return;

  if (isSimulation) {
    simulateCommand(cmd, params);
    return;
  }

  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({ command: cmd, ...params }));
}

/**
 * Render the main data table.
 */
function renderStaticTable(d) {
  const table = el('data-table');
  if (!table || !d) return;

  const locked = isLockedStatus(d.lock_status);

  const rows = [
    [t('model'), escapeHtml(d.model || '-')],
    [t('cycles'), escapeHtml(d.charge_cycles ?? '-')],
    [t('state'), locked
      ? `<span class="badge badge-danger">${t('locked')}</span>`
      : `<span class="badge badge-success">${t('unlocked')}</span>`
    ],
    [t('capacity'), escapeHtml(d.capacity || '-')],
    [t('mfg_date'), escapeHtml(d.mfg_date || '-')],
    [t('lbl_total_voltage'), formatVoltage(d.pack_voltage, 2)],
    [t('rom_id'), escapeHtml(d.rom_id || '-')]
  ];

  table.innerHTML = rows.map(r => `
    <div class="kv-row">
      <span class="k">${r[0]}</span>
      <span class="v">${r[1]}</span>
    </div>
  `).join('');
}

/**
 * Render battery cells.
 */
function renderCells(d) {
  const area = el('cellsArea');
  const nums = el('cellsNumbers');
  if (!area || !d || !Array.isArray(d.cell_voltages)) return;

  area.innerHTML = d.cell_voltages.map((rawV, i) => {
    const v = safeNumber(rawV);
    const pct = Math.min(100, Math.max(0, (v - 2.5) / (4.2 - 2.5) * 100));

    let colorClass = 'bg-ok';
    if (v < 0.5) colorClass = 'dead-cell';
    else if (v < 3.0) colorClass = 'crit-low-animated';
    else if (v < 3.3) colorClass = 'bg-error';
    else if (v < 3.6) colorClass = 'bg-warning';

    return `
      <div class="cell-container">
        <div class="cell-cap"></div>
        <div class="cell-gfx">
          <div class="cell-gfx-content">
            <span class="cell-pole">+</span>
            <span class="cell-gfx-vol">${v.toFixed(2)}V</span>
            <span class="cell-pole">-</span>
          </div>
          <div class="cell-level-bar ${colorClass}" style="height:${pct}%;"></div>
        </div>
        <div class="cell-number">${t('cell')} ${i + 1}</div>
      </div>
    `;
  }).join('');

  if (nums) nums.innerHTML = '';

  const packSummary = el('packSummary');
  if (packSummary) {
    packSummary.innerHTML = `${t('sum_total')}: <strong>${safeNumber(d.pack_voltage).toFixed(2)}V</strong> | ${t('sum_diff')}: <span style="color:red">${safeNumber(d.cell_diff).toFixed(3)}V</span>`;
  }

  renderAdvancedDiagnostics(d);
}

/**
 * Advanced diagnostics: temperature, SOH, model comparison, balancing and HUD.
 */
function renderAdvancedDiagnostics(d) {
  if (!d || !Array.isArray(d.cell_voltages)) return;

  const cycles = safeNumber(d.charge_cycles);
  const diff = safeNumber(d.cell_diff);

  let fatigueLevel = 'fatigue_low';
  if (cycles > 150 || diff > 0.15) fatigueLevel = 'fatigue_med';
  if (cycles > 300 || diff > 0.25) fatigueLevel = 'fatigue_high';

  let health = 100 - (cycles / 10);
  health -= (diff * 40);
  health = Math.max(0, Math.round(health));

  const ring = el('sohRing');
  const label = el('sohLabel');
  if (ring && label) {
    ring.textContent = health + '%';
    ring.className = 'soh-ring ' + (health > 80 ? 'good' : (health > 50 ? 'fair' : 'poor'));

    let hLabel = 'health_good';
    if (health <= 80) hLabel = 'health_fair';
    if (health <= 50) hLabel = 'health_poor';
    if (health <= 20) hLabel = 'health_dead';

    label.innerHTML = `${t(hLabel)}<br><small style="font-size:10px; opacity:0.7">${t(fatigueLevel)}</small>`;
  }

  renderModelComparison(d);
  renderBalancingAssistant(d);

  if (d.temp1 !== undefined && d.temp2 !== undefined) {
    const temp1 = safeNumber(d.temp1);
    const temp2 = safeNumber(d.temp2);
    const tValues = el('tempValues');

    if (tValues) tValues.innerHTML = `${temp1.toFixed(1)}&deg;C | ${temp2.toFixed(1)}&deg;C`;

    const tempBar1 = el('tempBar1');
    const tempBar2 = el('tempBar2');
    if (tempBar1) tempBar1.style.height = Math.min(100, (temp1 / 60) * 100) + '%';
    if (tempBar2) tempBar2.style.height = Math.min(100, (temp2 / 60) * 100) + '%';
  }

  renderImbalanceHUD(d);
  updateImbalanceBadge(diff);
}

function renderModelComparison(d) {
  const container = el('modelComparison');
  const section = el('modelSection');
  if (!container || !section || !d.model) return;

  const modelKey = d.model.split('/')[0].split(' ')[0].trim();
  const nominal = MAKITA_MODELS[modelKey];

  if (nominal) {
    section.classList.remove('hidden');
    container.innerHTML = `
      <div class="kv-row"><span>${t('lbl_nominal_cap')}</span><strong>${escapeHtml(nominal.cap)}</strong></div>
      <div class="kv-row"><span>${t('lbl_config')}</span><strong>${escapeHtml(nominal.config)}</strong></div>
      <div class="kv-row"><span>${t('lbl_cells')}</span><strong>${escapeHtml(nominal.cells)}</strong></div>
      <div class="kv-row"><span>${t('lbl_current_state')}</span><strong>${escapeHtml(d.capacity || '-')}</strong></div>
    `;
  } else {
    section.classList.add('hidden');
  }
}

function renderBalancingAssistant(d) {
  const container = el('balanceAssistant');
  const section = el('balanceSection');
  if (!container || !section || !Array.isArray(d.cell_voltages)) return;

  const cellDiff = safeNumber(d.cell_diff);

  if (cellDiff > 0.05) {
    section.classList.remove('hidden');
    const avgV = d.cell_voltages.reduce((a, b) => a + safeNumber(b), 0) / d.cell_voltages.length;

    let html = `<p>${t('lbl_imbalance_detected')} <strong>${cellDiff.toFixed(3)}V</strong></p>`;

    d.cell_voltages.forEach((rawV, i) => {
      const v = safeNumber(rawV);
      const diff = v - avgV;

      if (Math.abs(diff) > 0.02) {
        const action = diff > 0 ? t('lbl_action_discharge') : t('lbl_action_charge');
        const color = diff > 0 ? 'var(--error)' : 'var(--accent)';
        html += `
          <div class="balance-step">
            <span style="color:${color}">&bull;</span>
            <span>${t('cell')} ${i + 1}: <strong>${action}</strong> (~${(Math.abs(diff) * 500).toFixed(0)} mAh)</span>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  } else {
    section.classList.add('hidden');
  }
}

function generateReport() {
  if (!lastData) return;

  const d = lastData;
  const date = new Date().toLocaleString(getLocale());
  const soh = el('sohRing') ? el('sohRing').textContent : '-';
  const temps = el('tempValues') ? el('tempValues').textContent : '-';
  const model = d.model || 'Unknown';

  let report = `==========================================\n`;
  report += `   ${t('report_title')}\n`;
  report += `==========================================\n\n`;
  report += `${t('report_date')}: ${date}\n`;
  report += `${t('report_model')}: ${model}\n`;
  report += `${t('report_rom_id')}: ${d.rom_id || '-'}\n`;
  report += `${t('report_state')}: ${translatedLockStatus(d.lock_status)}\n\n`;
  report += `------------------------------------------\n`;
  report += `${t('report_cell_diag')}\n`;
  report += `------------------------------------------\n`;

  if (Array.isArray(d.cell_voltages)) {
    d.cell_voltages.forEach((rawV, i) => {
      report += `${t('cell')} ${i + 1}: ${safeNumber(rawV).toFixed(3)}V\n`;
    });
  }

  report += `\n${t('report_total_voltage')}: ${safeNumber(d.pack_voltage).toFixed(2)}V\n`;
  report += `${t('report_imbalance')}: ${safeNumber(d.cell_diff).toFixed(3)}V\n`;
  report += `${t('report_cycles')}: ${d.charge_cycles ?? '-'}\n\n`;
  report += `------------------------------------------\n`;
  report += `${t('report_soh')}: ${soh}\n`;
  report += `${t('report_temps')}: ${temps}\n`;
  report += `==========================================\n`;
  report += `${t('report_generated_by')}\n`;

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${t('report_file_prefix')}_${model.replace(/\s/g, '_')}.txt`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  log(t('report_generated_success'));
}

/**
 * Cell imbalance HUD.
 */
function renderImbalanceHUD(d) {
  const container = el('imbalanceHUD');
  if (!container || !Array.isArray(d.cell_voltages)) return;

  const avg = d.cell_voltages.reduce((a, b) => a + safeNumber(b), 0) / d.cell_voltages.length;

  container.innerHTML = d.cell_voltages.map((rawV, i) => {
    const v = safeNumber(rawV);
    const diff = v - avg;
    const absDiff = Math.abs(diff);
    const width = Math.min(100, (absDiff / 0.2) * 100);
    const color = absDiff > 0.1 ? 'var(--error)' : (absDiff > 0.05 ? 'var(--warning)' : 'var(--success)');

    return `
      <div class="hud-row">
        <span class="hud-label">${t('cell')} ${i + 1}</span>
        <div class="hud-bar-bg">
          <div class="hud-bar-fill" style="width: ${width}%; background: ${color}; ${diff < 0 ? 'right: 0' : 'left: 0'}"></div>
        </div>
        <span class="hud-val" style="color: ${color}">${diff > 0 ? '+' : ''}${diff.toFixed(3)}</span>
      </div>
    `;
  }).join('');
}

/**
 * Header badge for imbalance status.
 */
function updateImbalanceBadge(diff) {
  const badge = el('imbalanceBadge');
  if (!badge) return;

  const cellDiff = safeNumber(diff);

  badge.classList.remove('hidden');
  badge.classList.remove('bal-ok', 'bal-warn', 'bal-crit');

  let text = '';
  let icon = '';

  if (cellDiff < 0.05) {
    badge.classList.add('bal-ok');
    text = t('bal_ok');
    icon = 'OK';
  } else if (cellDiff < 0.15) {
    badge.classList.add('bal-warn');
    text = t('bal_warn');
    icon = '!';
  } else {
    badge.classList.add('bal-crit');
    text = t('bal_crit');
    icon = '!!';
  }

  badge.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
}

function updateButtonStates(f) {
  const btnDynamic = el('btnReadDynamic');
  const btnClear = el('btnClearErrors');
  const btnLed = el('btnLed');
  const serviceActions = el('serviceActions');

  if (btnDynamic) btnDynamic.disabled = !f.read_dynamic;
  if (btnClear) btnClear.disabled = !f.clear_errors;
  if (btnLed) btnLed.disabled = !f.led_test;
  if (serviceActions) serviceActions.classList.toggle('hidden', !(f.clear_errors || f.led_test));

  const auto = el('checkAuto');
  toggleAutoPolling(Boolean(auto && auto.checked));
}

function toggleAutoPolling(active) {
  clearInterval(pollInterval);
  pollInterval = null;
  savePref('auto', active);

  const btnDynamic = el('btnReadDynamic');

  if (active && isConnected && btnDynamic && !btnDynamic.disabled) {
    pollInterval = setInterval(() => {
      sendCommand('read_dynamic');
    }, 3000);
  }
}

function updatePresence(present) {
  if (!present && lastData) {
    refreshStatus();
    return;
  }

  lastPresence = present;
  refreshStatus();

  if (!present && isConnected) {
    const overview = el('overviewCard');
    const serviceActions = el('serviceActions');

    if (overview) overview.classList.add('hidden');
    if (serviceActions) serviceActions.classList.add('hidden');

    lastData = null;
  }
}

function showNotification(msg, type) {
  const n = el('notification');
  if (!n) return;

  n.textContent = msg;
  n.className = type;
  n.classList.remove('hidden');

  setTimeout(() => n.classList.add('hidden'), 4000);
}

function log(msg) {
  const logEl = el('log');
  if (!logEl) return;

  const d = new Date();
  const ts =
    d.getHours().toString().padStart(2, '0') + ':' +
    d.getMinutes().toString().padStart(2, '0') + ':' +
    d.getSeconds().toString().padStart(2, '0');

  logEl.textContent += `\n[${ts}] ${msg}`;
  logEl.scrollTop = logEl.scrollHeight;
}

function setupEventListeners() {
  log(t('log_evt_config'));

  const bStatic = el('btnReadStatic');
  const bDynamic = el('btnReadDynamic');
  const bClear = el('btnClearErrors');
  const bLed = el('btnLed');
  const bEN = el('btnEN');
  const bNL = el('btnNL');

  if (bStatic) {
    bStatic.addEventListener('click', () => {
      log(t('log_req_static'));
      sendCommand('read_static');
    });
  }

  if (bDynamic) {
    bDynamic.addEventListener('click', () => {
      log(t('log_req_dynamic'));
      sendCommand('read_dynamic');
    });
  }

  if (bClear) {
    bClear.addEventListener('click', () => {
      if (confirm(t('log_clear_confirm'))) sendCommand('clear_errors');
    });
  }

  let ledOn = false;
  if (bLed) {
    bLed.addEventListener('click', () => {
      ledOn = !ledOn;
      sendCommand(ledOn ? 'led_on' : 'led_off');
    });
  }

  const setLang = lang => {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    currentLang = lang;
    applyTranslations();
    log(tr('log_lang_changed', { lang: lang.toUpperCase() }));

    if (isConnected) {
      const isDark = document.body.classList.contains('dark-mode');
      sendCommand('save_config', { lang: lang, theme: isDark ? 'dark' : 'light' });
    }
  };

  if (bEN) bEN.addEventListener('click', () => setLang('en'));
  if (bNL) bNL.addEventListener('click', () => setLang('nl'));

  const bAuto = el('checkAuto');
  if (bAuto) bAuto.addEventListener('change', e => toggleAutoPolling(e.target.checked));

  const bLight = el('themeLight');
  const bDark = el('themeDark');
  if (bLight) bLight.addEventListener('click', () => setTheme('light'));
  if (bDark) bDark.addEventListener('click', () => setTheme('dark'));

  const bExp = el('btnExport');
  if (bExp) bExp.addEventListener('click', generateReport);

  const bSys = el('btnSystem');
  if (bSys) {
    bSys.addEventListener('click', () => {
      const systemSection = el('systemSection');
      if (systemSection) systemSection.classList.toggle('hidden');
    });
  }

  const bOta = el('btnOta');
  const fOta = el('otaFile');
  if (bOta && fOta) {
    bOta.addEventListener('click', () => fOta.click());
    fOta.addEventListener('change', () => uploadFirmware(fOta.files[0]));
  }

  const bWifi = el('btnSaveWifi');
  if (bWifi) {
    bWifi.addEventListener('click', () => {
      const wifiSSID = el('wifiSSID');
      const wifiPass = el('wifiPass');
      const ssid = wifiSSID ? wifiSSID.value.trim() : '';
      const pass = wifiPass ? wifiPass.value : '';

      if (!ssid) {
        alert(t('wifi_ssid_missing'));
        return;
      }

      if (confirm(tr('wifi_confirm', { ssid }))) {
        sendCommand('set_wifi', { ssid: ssid, pass: pass });
      }
    });
  }
}

/**
 * Firmware upload to the ESP8266.
 */
function uploadFirmware(file) {
  if (!file) return;
  if (!confirm(t('ota_confirm'))) return;

  const formData = new FormData();
  formData.append('update', file);

  const xhr = new XMLHttpRequest();
  const bar = el('otaBar');
  const container = el('otaProgress');
  const percentText = el('otaPercent');

  if (container) container.classList.remove('hidden');

  xhr.open('POST', '/update', true);

  xhr.upload.onprogress = e => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      if (bar) bar.style.width = pct + '%';
      if (percentText) percentText.textContent = pct + '%';
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200 && xhr.responseText.trim() === 'OK') {
      log(t('ota_success_log'));
      showNotification(t('ota_success_note'), 'success');
      setTimeout(() => window.location.reload(), 5000);
    } else {
      log(t('ota_fail_log'));
      showNotification(t('ota_fail_note'), 'danger');
      if (container) container.classList.add('hidden');
    }
  };

  xhr.onerror = () => {
    log(t('ota_fail_log'));
    showNotification(t('ota_fail_note'), 'danger');
    if (container) container.classList.add('hidden');
  };

  xhr.send(formData);
}


