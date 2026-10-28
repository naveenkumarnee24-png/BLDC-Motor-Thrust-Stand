/* =========================================================================
   BLDC MOTOR THRUST TEST STAND - APPLICATION CONTROLLER
   Features:
   - Persistent Auth (Remember Login State in localStorage)
   - Multilingual Engine (EN, TA, HI, ES, DE, FR)
   - Web Serial API Engine (Direct 9600-Baud USB connection to Arduino UNO)
   - Built-in Realistic BLDC Motor Simulator
   - Chart.js Real-time Telemetry Graphs (Thrust, Current, RPM)
   - Telemetry History Logging & CSV Export
   - Dynamic Propeller Speed Synchronization & Aerodynamic Calculations
   ========================================================================= */

// ---------------------------------------------------------------------------
// 1. MULTILINGUAL TRANSLATION DICTIONARY (6 Languages)
// ---------------------------------------------------------------------------
const i18n = {
  en: {
    login_title: "BLDC Test Stand Portal",
    login_subtitle: "Authenticate to access real-time motor thrust, current, and RPM telemetry.",
    lbl_username: "Operator ID / Username",
    lbl_password: "Security Key / Password",
    lbl_remember: "Remember me on this workstation",
    btn_quick_fill: "Quick Auto-Fill",
    btn_login: "Authorize & Enter Dashboard",
    login_hint: "Default login: admin / thrust2026 (Saved in browser)",
    app_category: "S5 MINI PROJECT • EEE / ROBOTICS",
    app_title: "BLDC MOTOR THRUST TEST STAND",
    tab_dashboard: "Live Dashboard",
    tab_history: "History & Analytics",
    btn_connect_arduino: "Connect Arduino",
    btn_disconnect_arduino: "Disconnect",
    status_standby: "Standby",
    status_connected: "Hardware Active",
    status_simulated: "Simulator Running",
    telemetry_active: "LIVE ARDUINO UNO HARDWARE TELEMETRY",
    hero_title: "Welcome to BLDC Thrust Stand Dashboard",
    hero_subtitle: "Acquiring real-time aerodynamic thrust, HX711 raw load cell force, ACS712 current draw, and optical interrupt rotational speed (RPM).",
    meta_protocol: "Protocol",
    meta_sampling: "Sample Rate",
    meta_mcu: "Target MCU",
    tag_aerodynamic: "AERODYNAMIC FORCE",
    metric_thrust: "Thrust Force",
    sub_peak_thrust: "Peak:",
    sub_converted: "Newtons:",
    btn_tare: "Tare",
    tag_sensor: "LOAD CELL RAW ADC",
    metric_raw_load: "Raw Load Value",
    sub_zero_offset: "Zero Baseline:",
    sub_scale_factor: "Scale Factor:",
    tag_electrical: "CURRENT SENSOR",
    metric_current: "Current Consumption",
    sub_power: "Electrical Power:",
    sub_battery: "Voltage (3S):",
    tag_speed: "OPTICAL TACHOMETER",
    metric_rpm: "Rotations Per Minute",
    sub_peak_rpm: "Peak Speed:",
    sub_frequency: "Frequency:",
    motor_visualizer_title: "BLDC Propulsion Dynamics",
    state_dynamic: "DYNAMIC",
    spec_thrust_ratio: "Thrust / Weight",
    spec_efficiency: "Aero Efficiency",
    spec_blade_speed: "Tip Speed",
    desc_stand_title: "Precision Aerospace Test Rig",
    desc_stand_text: "Dual-axis load sensor configuration measuring vertical thrust vector with optical beam interrupt RPM counting.",
    live_serial_stream: "Live Hardware Serial Stream",
    btn_clear: "Clear",
    sim_control: "Simulator Throttle Control",
    history_title: "Telemetry History & Performance Analytics",
    history_subtitle: "Comprehensive historical tracking of Thrust (g), Current (A), and Rotational Velocity (RPM) over test runs.",
    btn_export_csv: "Export Data (CSV)",
    btn_clear_history: "Clear History",
    hist_max_thrust: "MAXIMUM RECORDED THRUST",
    hist_max_current: "PEAK CURRENT DRAW",
    hist_max_rpm: "MAX ROTATIONAL VELOCITY",
    hist_avg_eff: "AVG AERODYNAMIC EFFICIENCY",
    hist_samples: "Calculated from run",
    chart_thrust_title: "Thrust Force History (g)",
    chart_current_title: "Current Draw History (A)",
    chart_rpm_title: "Rotations Per Minute History (RPM) & Power Correlation",
    lbl_realtime: "REAL-TIME",
    table_title: "Recorded Telemetry Samples",
    th_time: "Timestamp",
    th_raw: "Raw ADC",
    th_thrust: "Thrust (g)",
    th_thrust_n: "Thrust (N)",
    th_current: "Current (A)",
    th_power: "Power (W)",
    th_rpm: "RPM",
    th_eff: "Efficiency (g/W)",
    table_empty: "No telemetry samples recorded yet. Connect Arduino or start Simulator to capture data."
  },
  ta: {
    login_title: "BLDC சோதனை முகப்பு",
    login_subtitle: "மோட்டார் உந்துதல் (Thrust), மின்னோட்டம் மற்றும் சுழற்சி வேகத்தை (RPM) கண்காணிக்க உள்நுழையவும்.",
    lbl_username: "பயனர் பெயர் / ஐடி",
    lbl_password: "கடவுச்சொல்",
    lbl_remember: "என்னை நினைவில் வைத்துக்கொள்",
    btn_quick_fill: "தானியங்கி நிரப்புதல்",
    btn_login: "அங்கீகரித்து உள்நுழைக",
    login_hint: "இயல்புநிலை: admin / thrust2026 (உலாவியில் சேமிக்கப்படும்)",
    app_category: "S5 மினி பிராஜெக்ட் • EEE / ரோபாட்டிக்ஸ்",
    app_title: "BLDC மோட்டார் உந்துதல் சோதனை மையம்",
    tab_dashboard: "நேரலை முகப்பு",
    tab_history: "வரலாறு மற்றும் பகுப்பாய்வு",
    btn_connect_arduino: "ஆர்டுயினோவை இணைக்கவும்",
    btn_disconnect_arduino: "துண்டிக்கவும்",
    status_standby: "காத்திருப்பு",
    status_connected: "இயங்குகிறது (நேரலை)",
    status_simulated: "மாதிரி இயக்கம் (Sim)",
    telemetry_active: "நேரலை ஆர்டுயினோ UNO தொலைக்கணிப்பு",
    hero_title: "BLDC உந்துதல் சோதனை முகப்பிற்கு வருக",
    hero_subtitle: "உண்மையான நேரத்தில் காற்று உந்துவிசை (Thrust), HX711 சென்சார் எடை, ACS712 மின்னோட்டம் மற்றும் IR ஆப்டிகல் RPM தரவுகள் பெறப்படுகின்றன.",
    meta_protocol: "நெறிமுறை",
    meta_sampling: "மாதிரி விகிதம்",
    meta_mcu: "நுண்கட்டுப்படுத்தி",
    tag_aerodynamic: "காற்று உந்துவிசை",
    metric_thrust: "உந்துதல் விசை (Thrust)",
    sub_peak_thrust: "அதிகபட்சம்:",
    sub_converted: "நியூட்டன்:",
    btn_tare: "பூஜ்ஜியமாக்கு (Tare)",
    tag_sensor: "சுமை சென்சார் ADC",
    metric_raw_load: "மூல சுமை மதிப்பு (Raw)",
    sub_zero_offset: "அடிப்படை பூஜ்ஜியம்:",
    sub_scale_factor: "அளவுகோல் காரணி:",
    tag_electrical: "மின்னோட்ட உணரி",
    metric_current: "மின்னோட்டம் (Current)",
    sub_power: "மின் சக்தி (Power):",
    sub_battery: "மின்னழுத்தம் (3S):",
    tag_speed: "சுழற்சி உணரி (RPM)",
    metric_rpm: "நிமிடத்திற்கான சுழற்சிகள்",
    sub_peak_rpm: "அதிவேகம்:",
    sub_frequency: "அதிர்வெண்:",
    motor_visualizer_title: "BLDC இயக்கம் & சுழலி காட்சி",
    state_dynamic: "இயக்கம்",
    spec_thrust_ratio: "உந்துதல் / எடை",
    spec_efficiency: "திறன் (Aero Eff)",
    spec_blade_speed: "இறக்கை வேகம்",
    desc_stand_title: "துல்லியமான சோதனை மேடை",
    desc_stand_text: "செங்குத்து உந்துதல் விசை மற்றும் ஆப்டிகல் சுழற்சி வேகத்தை அளவிடும் இரட்டை சென்சார் கட்டமைப்பு.",
    live_serial_stream: "நேரலை சீரியல் தரவு (Serial Data)",
    btn_clear: "துடைக்கவும்",
    sim_control: "மாதிரி உந்துவிசை கட்டுப்பாடு (Throttle)",
    history_title: "தொலைக்கணிப்பு வரலாறு & பகுப்பாய்வு",
    history_subtitle: "உந்துதல் (g), மின்னோட்டம் (A) மற்றும் RPM ஆகியவற்றின் தொடர் பதிவு விவரங்கள்.",
    btn_export_csv: "பதிவிறக்கு (CSV)",
    btn_clear_history: "வரலாற்றை நீக்கு",
    hist_max_thrust: "அதிகபட்ச உந்துதல்",
    hist_max_current: "அதிகபட்ச மின்னோட்டம்",
    hist_max_rpm: "அதிகபட்ச RPM வேகம்",
    hist_avg_eff: "சராசரி ஏரோ திறன்",
    hist_samples: "சோதனையிலிருந்து கணக்கிடப்பட்டது",
    chart_thrust_title: "உந்துதல் விசை வரைபடம் (g)",
    chart_current_title: "மின்னோட்டம் வரைபடம் (A)",
    chart_rpm_title: "RPM சுழற்சி மற்றும் சக்தி வரைபடம்",
    lbl_realtime: "நேரலை",
    table_title: "பதிவு செய்யப்பட்ட தரவுப் பட்டியல்",
    th_time: "நேரம்",
    th_raw: "மூல ADC",
    th_thrust: "உந்துதல் (g)",
    th_thrust_n: "உந்துதல் (N)",
    th_current: "மின்னோட்டம் (A)",
    th_power: "சக்தி (W)",
    th_rpm: "RPM",
    th_eff: "திறன் (g/W)",
    table_empty: "தரவு எதுவும் இல்லை. ஆர்டுயினோவை இணைக்கவும் அல்லது சிமுலேட்டரைத் தொடங்கவும்."
  },
  hi: {
    login_title: "BLDC थ्रस्ट टेस्ट स्टैंड पोर्टल",
    login_subtitle: "वास्तविक समय मोटर थ्रस्ट, करंट और आरपीएम टेलीमेट्री के लिए लॉगिन करें।",
    lbl_username: "ऑपरेटर आईडी / उपयोगकर्ता नाम",
    lbl_password: "पासवर्ड / सुरक्षा कुंजी",
    lbl_remember: "मुझे इस सिस्टम पर याद रखें",
    btn_quick_fill: "ऑटो-फिल क्रेडेंशियल्स",
    btn_login: "लॉगिन करें और प्रवेश करें",
    login_hint: "डिफ़ॉल्ट लॉगिन: admin / thrust2026 (ब्राउज़र में सहेजा गया)",
    app_category: "S5 मिनी प्रोजेक्ट • ईईई / रोबोटिक्स",
    app_title: "BLDC मोटर थ्रस्ट टेस्ट स्टैंड",
    tab_dashboard: "लाइव डैशबोर्ड",
    tab_history: "इतिहास और विश्लेषण",
    btn_connect_arduino: "Arduino कनेक्ट करें",
    btn_disconnect_arduino: "डिस्कनेक्ट करें",
    status_standby: "स्टैंडबाय",
    status_connected: "हार्डवेयर सक्रिय",
    status_simulated: "सिम्युलेटर सक्रिय",
    telemetry_active: "लाइव ARDUINO UNO हार्डवेयर टेलीमेट्री",
    hero_title: "BLDC थ्रस्ट टेस्ट डैशबोर्ड में आपका स्वागत है",
    hero_subtitle: "HX711 लोड सेल, ACS712 करंट सेंसर और ऑप्टिकल आरपीएम सेंसर से लाइव डेटा प्राप्त हो रहा है।",
    meta_protocol: "प्रोटोकॉल",
    meta_sampling: "नमूना दर",
    meta_mcu: "लक्ष्य MCU",
    tag_aerodynamic: "वायुगतिकीय बल",
    metric_thrust: "थ्रस्ट बल (Thrust)",
    sub_peak_thrust: "शिखर मान:",
    sub_converted: "न्यूटन:",
    btn_tare: "शून्य करें (Tare)",
    tag_sensor: "लोड सेल रॉ ADC",
    metric_raw_load: "रॉ लोड मान",
    sub_zero_offset: "जीरो बेसलाइन:",
    sub_scale_factor: "स्केल फैक्टर:",
    tag_electrical: "करंट सेंसर",
    metric_current: "विद्युत धारा (Current)",
    sub_power: "विद्युत शक्ति:",
    sub_battery: "वोल्टेज (3S):",
    tag_speed: "ऑप्टिकल टैकोमीटर",
    metric_rpm: "घूर्णन प्रति मिनट (RPM)",
    sub_peak_rpm: "अधिकतम गति:",
    sub_frequency: "आवृत्ति:",
    motor_visualizer_title: "BLDC प्रोपल्शन डायनेमिक्स",
    state_dynamic: "डायनेमिक",
    spec_thrust_ratio: "थ्रस्ट / भार अनुपात",
    spec_efficiency: "एयरो दक्षता",
    spec_blade_speed: "ब्लेड टिप गति",
    desc_stand_title: "सटीक एयरोस्पेस टेस्ट रिग",
    desc_stand_text: "ऊर्ध्वाधर थ्रस्ट और ऑप्टिकल बीम आरपीएम मापने हेतु उच्च परिशुद्धता सेटअप।",
    live_serial_stream: "लाइव हार्डवेयर सीरियल डेटा",
    btn_clear: "साफ़ करें",
    sim_control: "सिम्युलेटर थ्रॉटल कंट्रोल",
    history_title: "टेलीमेट्री इतिहास और प्रदर्शन विश्लेषण",
    history_subtitle: "थ्रस्ट (g), करंट (A) और आरपीएम (RPM) का विस्तृत रिकॉर्ड इतिहास।",
    btn_export_csv: "डेटा डाउनलोड करें (CSV)",
    btn_clear_history: "इतिहास हटाएं",
    hist_max_thrust: "अधिकतम थ्रस्ट",
    hist_max_current: "शिखर करंट",
    hist_max_rpm: "अधिकतम आरपीएम गति",
    hist_avg_eff: "औसत एयरो दक्षता",
    hist_samples: "परीक्षण से परिकलित",
    chart_thrust_title: "थ्रस्ट बल इतिहास (g)",
    chart_current_title: "करंट खपत इतिहास (A)",
    chart_rpm_title: "आरपीएम और पावर इतिहास",
    lbl_realtime: "रियल-टाइम",
    table_title: "रिकॉर्ड किए गए डेटा नमूने",
    th_time: "समय",
    th_raw: "रॉ ADC",
    th_thrust: "थ्रस्ट (g)",
    th_thrust_n: "थ्रस्ट (N)",
    th_current: "करंट (A)",
    th_power: "पावर (W)",
    th_rpm: "RPM",
    th_eff: "दक्षता (g/W)",
    table_empty: "कोई डेटा दर्ज नहीं किया गया। Arduino कनेक्ट करें या सिम्युलेटर प्रारंभ करें।"
  },
  es: {
    login_title: "Portal Banco de Pruebas BLDC",
    login_subtitle: "Autentíquese para acceder a la telemetría en tiempo real de empuje, corriente y RPM.",
    lbl_username: "ID de Operador / Usuario",
    lbl_password: "Clave de Seguridad",
    lbl_remember: "Recordarme en esta estación",
    btn_quick_fill: "Autocompletar",
    btn_login: "Autorizar e Ingresar",
    login_hint: "Acceso predeterminado: admin / thrust2026 (Guardado en navegador)",
    app_category: "PROYECTO MINI S5 • EEE / ROBÓTICA",
    app_title: "BANCO DE PRUEBAS DE EMPUJE MOTOR BLDC",
    tab_dashboard: "Panel en Vivo",
    tab_history: "Historial y Análisis",
    btn_connect_arduino: "Conectar Arduino",
    btn_disconnect_arduino: "Desconectar",
    status_standby: "En Espera",
    status_connected: "Hardware Activo",
    status_simulated: "Simulador Activo",
    telemetry_active: "TELEMETRÍA EN VIVO ARDUINO UNO",
    hero_title: "Bienvenido al Panel del Banco de Empuje BLDC",
    hero_subtitle: "Capturando empuje aerodinámico, celda de carga HX711, corriente ACS712 y RPM ópticas en tiempo real.",
    meta_protocol: "Protocolo",
    meta_sampling: "Muestreo",
    meta_mcu: "MCU Objetivo",
    tag_aerodynamic: "FUERZA AERODINÁMICA",
    metric_thrust: "Fuerza de Empuje",
    sub_peak_thrust: "Pico:",
    sub_converted: "Newtons:",
    btn_tare: "Tarar",
    tag_sensor: "ADC CELDA DE CARGA",
    metric_raw_load: "Valor de Carga Bruto",
    sub_zero_offset: "Base Cero:",
    sub_scale_factor: "Factor Escala:",
    tag_electrical: "SENSOR DE CORRIENTE",
    metric_current: "Consumo de Corriente",
    sub_power: "Potencia Eléctrica:",
    sub_battery: "Voltaje (3S):",
    tag_speed: "TACÓMETRO ÓPTICO",
    metric_rpm: "Rotaciones Por Minuto",
    sub_peak_rpm: "Velocidad Pico:",
    sub_frequency: "Frecuencia:",
    motor_visualizer_title: "Dinámica de Propulsión BLDC",
    state_dynamic: "DINÁMICO",
    spec_thrust_ratio: "Empuje / Peso",
    spec_efficiency: "Eficiencia Aero",
    spec_blade_speed: "Velocidad Punta",
    desc_stand_title: "Banco de Pruebas Aeroespacial",
    desc_stand_text: "Configuración de sensor de carga de doble eje que mide el vector de empuje vertical con conteo óptico de RPM.",
    live_serial_stream: "Flujo Serie en Vivo",
    btn_clear: "Limpiar",
    sim_control: "Control del Simulador",
    history_title: "Historial de Telemetría y Rendimiento",
    history_subtitle: "Seguimiento exhaustivo de Empuje (g), Corriente (A) y RPM en tiempo real.",
    btn_export_csv: "Exportar Datos (CSV)",
    btn_clear_history: "Borrar Historial",
    hist_max_thrust: "EMPUJE MÁXIMO",
    hist_max_current: "CORRIENTE PICO",
    hist_max_rpm: "MÁXIMA VELOCIDAD RPM",
    hist_avg_eff: "EFICIENCIA AERO MEDIA",
    hist_samples: "Calculado de la prueba",
    chart_thrust_title: "Historial de Empuje (g)",
    chart_current_title: "Historial de Corriente (A)",
    chart_rpm_title: "Historial de RPM y Potencia",
    lbl_realtime: "TIEMPO REAL",
    table_title: "Muestras Registradas",
    th_time: "Hora",
    th_raw: "ADC Bruto",
    th_thrust: "Empuje (g)",
    th_thrust_n: "Empuje (N)",
    th_current: "Corriente (A)",
    th_power: "Potencia (W)",
    th_rpm: "RPM",
    th_eff: "Eficiencia (g/W)",
    table_empty: "No hay muestras registradas. Conecte Arduino o inicie el Simulador."
  },
  de: {
    login_title: "BLDC Schubprüfstand Portal",
    login_subtitle: "Melden Sie sich an, um auf Echtzeit-Telemetrie von Schub, Strom und Drehzahl zuzugreifen.",
    lbl_username: "Bediener-ID / Benutzername",
    lbl_password: "Sicherheitsschlüssel",
    lbl_remember: "Auf dieser Arbeitsstation merken",
    btn_quick_fill: "Automatisch ausfüllen",
    btn_login: "Autorisieren & Dashboard öffnen",
    login_hint: "Standard-Login: admin / thrust2026 (Im Browser gespeichert)",
    app_category: "S5 MINI-PROJEKT • EEE / ROBOTIK",
    app_title: "BLDC MOTOR SCHUBPRÜFSTAND",
    tab_dashboard: "Live-Dashboard",
    tab_history: "Verlauf & Analysen",
    btn_connect_arduino: "Arduino verbinden",
    btn_disconnect_arduino: "Trennen",
    status_standby: "Bereit",
    status_connected: "Hardware Aktiv",
    status_simulated: "Simulator Aktiv",
    telemetry_active: "LIVE ARDUINO UNO HARDWARE-TELEMETRIE",
    hero_title: "Willkommen beim BLDC Schubprüfstand Dashboard",
    hero_subtitle: "Erfassung von aerodynamischem Schub, HX711-Wägezelle, ACS712-Strom und optischer Drehzahl (RPM) in Echtzeit.",
    meta_protocol: "Protokoll",
    meta_sampling: "Abtastrate",
    meta_mcu: "Ziel-MCU",
    tag_aerodynamic: "AERODYNAMISCHE KRAFT",
    metric_thrust: "Schubkraft (Thrust)",
    sub_peak_thrust: "Spitze:",
    sub_converted: "Newton:",
    btn_tare: "Tarieren",
    tag_sensor: "WÄGEZELLE ROH-ADC",
    metric_raw_load: "Rohlastwert",
    sub_zero_offset: "Null-Basislinie:",
    sub_scale_factor: "Skalierungsfaktor:",
    tag_electrical: "STROMSENSOR",
    metric_current: "Stromverbrauch (A)",
    sub_power: "Elektrische Leistung:",
    sub_battery: "Spannung (3S):",
    tag_speed: "OPTISCHER DREHZAHLMESSER",
    metric_rpm: "Umdrehungen pro Minute",
    sub_peak_rpm: "Spitzengeschwindigkeit:",
    sub_frequency: "Frequenz:",
    motor_visualizer_title: "BLDC Antriebsdynamik",
    state_dynamic: "DYNAMISCH",
    spec_thrust_ratio: "Schub-Gewichts-Verhältnis",
    spec_efficiency: "Aero-Effizienz",
    spec_blade_speed: "Blattspitzengeschwindigkeit",
    desc_stand_title: "Präzisions-Teststand",
    desc_stand_text: "Doppelachsen-Sensorkonfiguration zur Messung von vertikalem Schub und optischer Drehzahlmessung.",
    live_serial_stream: "Live-Serieller Datenstrom",
    btn_clear: "Löschen",
    sim_control: "Simulator-Gaskontrolle",
    history_title: "Telemetrieverlauf & Leistungsanalyse",
    history_subtitle: "Umfassende Verlaufsaufzeichnung von Schub (g), Strom (A) und Drehzahl (RPM).",
    btn_export_csv: "Daten exportieren (CSV)",
    btn_clear_history: "Verlauf löschen",
    hist_max_thrust: "MAXIMALER SCHUB",
    hist_max_current: "SPITZENSTROM",
    hist_max_rpm: "MAXIMALE DREHZAHL",
    hist_avg_eff: "DURCHSCHN. EFFIZIENZ",
    hist_samples: "Aus Testlauf ermittelt",
    chart_thrust_title: "Schubkraft-Verlauf (g)",
    chart_current_title: "Stromverbrauch-Verlauf (A)",
    chart_rpm_title: "Drehzahl- und Leistungsverlauf",
    lbl_realtime: "ECHTZEIT",
    table_title: "Aufgezeichnete Telemetriedaten",
    th_time: "Zeitstempel",
    th_raw: "Roh-ADC",
    th_thrust: "Schub (g)",
    th_thrust_n: "Schub (N)",
    th_current: "Strom (A)",
    th_power: "Leistung (W)",
    th_rpm: "RPM",
    th_eff: "Effizienz (g/W)",
    table_empty: "Noch keine Telemetriedaten aufgezeichnet. Arduino verbinden oder Simulator starten."
  },
  fr: {
    login_title: "Portail Banc d'Essai BLDC",
    login_subtitle: "Connectez-vous pour accéder à la télémétrie en temps réel de la poussée, du courant et du régime moteur.",
    lbl_username: "ID Opérateur / Nom d'utilisateur",
    lbl_password: "Mot de passe",
    lbl_remember: "Se souvenir de moi sur ce poste",
    btn_quick_fill: "Remplissage auto",
    btn_login: "Autoriser et Entrer",
    login_hint: "Identifiants par défaut: admin / thrust2026 (Enregistré dans le navigateur)",
    app_category: "MINI-PROJET S5 • EEE / ROBOTIQUE",
    app_title: "BANC D'ESSAI DE POUSSÉE MOTEUR BLDC",
    tab_dashboard: "Tableau de Bord en Direct",
    tab_history: "Historique & Analyse",
    btn_connect_arduino: "Connecter Arduino",
    btn_disconnect_arduino: "Déconnecter",
    status_standby: "En attente",
    status_connected: "Matériel Actif",
    status_simulated: "Simulateur Actif",
    telemetry_active: "TÉLÉMÉTRIE EN DIRECT ARDUINO UNO",
    hero_title: "Bienvenue sur le Tableau de Bord du Banc BLDC",
    hero_subtitle: "Acquisition en direct de la poussée aérodynamique, cellule HX711, courant ACS712 et régime optique (RPM).",
    meta_protocol: "Protocole",
    meta_sampling: "Échantillonnage",
    meta_mcu: "MCU Cible",
    tag_aerodynamic: "FORCE AÉRODYNAMIQUE",
    metric_thrust: "Force de Poussée",
    sub_peak_thrust: "Pic:",
    sub_converted: "Newtons:",
    btn_tare: "Tarer",
    tag_sensor: "ADC CAPTEUR DE FORCE",
    metric_raw_load: "Valeur Brute ADC",
    sub_zero_offset: "Ligne Zéro:",
    sub_scale_factor: "Facteur d'Échelle:",
    tag_electrical: "CAPTEUR DE COURANT",
    metric_current: "Consommation Courant",
    sub_power: "Puissance Électrique:",
    sub_battery: "Tension (3S):",
    tag_speed: "TACHYMÈTRE OPTIQUE",
    metric_rpm: "Rotations Par Minute",
    sub_peak_rpm: "Vitesse Maximale:",
    sub_frequency: "Fréquence:",
    motor_visualizer_title: "Dynamique de Propulsion BLDC",
    state_dynamic: "DYNAMIQUE",
    spec_thrust_ratio: "Poussée / Poids",
    spec_efficiency: "Efficacité Aéro",
    spec_blade_speed: "Vitesse Bout de Pale",
    desc_stand_title: "Banc d'Essai Aérospatial",
    desc_stand_text: "Configuration de capteur à deux axes mesurant la poussée verticale et comptage optique des RPM.",
    live_serial_stream: "Flux Série en Direct",
    btn_clear: "Effacer",
    sim_control: "Commande Gaz Simulateur",
    history_title: "Historique & Analyse de Performance",
    history_subtitle: "Suivi chronologique complet de la poussée (g), du courant (A) et des RPM.",
    btn_export_csv: "Exporter Données (CSV)",
    btn_clear_history: "Effacer Historique",
    hist_max_thrust: "POUSSÉE MAXIMALE",
    hist_max_current: "COURANT DE CRÊTE",
    hist_max_rpm: "RÉGIME MAXIMAL",
    hist_avg_eff: "EFFICACITÉ MOYENNE",
    hist_samples: "Calculé sur la session",
    chart_thrust_title: "Historique de Poussée (g)",
    chart_current_title: "Historique de Courant (A)",
    chart_rpm_title: "Historique RPM et Puissance",
    lbl_realtime: "TEMPS RÉEL",
    table_title: "Échantillons Enregistrés",
    th_time: "Heure",
    th_raw: "ADC Brut",
    th_thrust: "Poussée (g)",
    th_thrust_n: "Poussée (N)",
    th_current: "Courant (A)",
    th_power: "Puissance (W)",
    th_rpm: "RPM",
    th_eff: "Efficacité (g/W)",
    table_empty: "Aucune donnée enregistrée. Connectez l'Arduino ou lancez le simulateur."
  }
};

let currentLang = 'en';

function applyLanguage(langCode) {
  if (!i18n[langCode]) langCode = 'en';
  currentLang = langCode;
  localStorage.setItem('bldc_lang_pref', langCode);

  const langNames = {
    en: 'English (EN)',
    ta: 'தமிழ் (Tamil)',
    hi: 'हिन्दी (Hindi)',
    es: 'Español (ES)',
    de: 'Deutsch (DE)',
    fr: 'Français (FR)'
  };
  const labelEl = document.getElementById('currentLangLabel');
  if (labelEl) labelEl.textContent = langNames[langCode] || 'English';

  // Update elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[langCode] && i18n[langCode][key]) {
      el.textContent = i18n[langCode][key];
    }
  });

  // Update active state in menu
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === langCode);
  });
}

function toggleLangDropdown() {
  const wrapper = document.querySelector('.lang-dropdown-wrapper');
  if (wrapper) wrapper.classList.toggle('open');
}

function selectLanguage(langCode) {
  applyLanguage(langCode);
  const wrapper = document.querySelector('.lang-dropdown-wrapper');
  if (wrapper) wrapper.classList.remove('open');
  showToast(`Language switched to ${langCode.toUpperCase()}`, 'info');
}

// Close language dropdown if clicked outside
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.lang-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});

// ---------------------------------------------------------------------------
// 2. AUTHENTICATION & SESSION PERSISTENCE (Once logged in, stays logged in)
// ---------------------------------------------------------------------------
const AUTH_KEY = 'bldc_auth_session';

function checkExistingAuth() {
  const session = localStorage.getItem(AUTH_KEY);
  if (session) {
    try {
      const data = JSON.parse(session);
      if (data && data.authenticated) {
        showAppScreen();
        return;
      }
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
    }
  }
  showLoginScreen();
}

function handleLogin(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Acceptance criteria: Default admin/thrust2026 or any valid non-empty login
  if ((usernameInput.toLowerCase() === 'admin' && passwordInput === 'thrust2026') || 
      (usernameInput.length >= 3 && passwordInput.length >= 4)) {
    
    if (rememberMe) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        authenticated: true,
        user: usernameInput,
        loginTime: new Date().toISOString()
      }));
    } else {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({
        authenticated: true,
        user: usernameInput
      }));
    }

    showToast(`Welcome back, ${usernameInput}! Access granted.`, 'success');
    showAppScreen();
  } else {
    showToast('Invalid credentials! Default: admin / thrust2026', 'error');
  }
}

function handleLogout() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  if (serialPort) {
    disconnectSerial();
  }
  if (simInterval) {
    toggleSimMode(false);
  }
  showToast('Logged out successfully.', 'info');
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('appScreen').classList.remove('active');
}

function showAppScreen() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('appScreen').classList.add('active');
  initChartsIfNeeded();
}

function togglePasswordVisibility() {
  const pwd = document.getElementById('password');
  const eye = document.getElementById('passwordEyeIcon');
  if (pwd.type === 'password') {
    pwd.type = 'text';
    eye.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    pwd.type = 'password';
    eye.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function quickFillDemo() {
  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = 'thrust2026';
  showToast('Default credentials loaded.', 'info');
}

// ---------------------------------------------------------------------------
// 3. SLIDE TRANSITIONS (Slide 1: Dashboard vs Slide 2: History & Analytics)
// ---------------------------------------------------------------------------
let activeSlide = 'dashboard';

function switchSlide(slideName) {
  activeSlide = slideName;
  const tabDash = document.getElementById('tabDashboard');
  const tabHist = document.getElementById('tabHistory');
  const slideDash = document.getElementById('slideDashboard');
  const slideHist = document.getElementById('slideHistory');

  if (slideName === 'dashboard') {
    tabDash.classList.add('active');
    tabHist.classList.remove('active');
    slideDash.classList.add('active');
    slideHist.classList.remove('active');
  } else {
    tabHist.classList.add('active');
    tabDash.classList.remove('active');
    slideHist.classList.add('active');
    slideDash.classList.remove('active');
    // Resize charts upon visibility
    if (chartThrust) chartThrust.resize();
    if (chartCurrent) chartCurrent.resize();
    if (chartRPM) chartRPM.resize();
  }
}

// ---------------------------------------------------------------------------
// 4. TELEMETRY STATE & METRIC CONVERSIONS
// ---------------------------------------------------------------------------
let telemetry = {
  raw: 86511,
  thrustGrams: 0.0,
  currentAmps: 0.0,
  rpm: 0,
  voltage: 11.1, // Default 3S
  powerWatts: 0.0,
  efficiency: 0.0,
  zeroOffset: 86511,
  scaleFactor: 68.81,
  thrustUnit: 'g' // 'g' or 'N'
};

let telemetryHistory = [];
const MAX_HISTORY_RECORDS = 500;
let peakValues = {
  thrust: 0.0,
  thrustTime: '--:--:--',
  current: 0.0,
  currentTime: '--:--:--',
  rpm: 0,
  rpmTime: '--:--:--'
};

function toggleThrustUnit() {
  telemetry.thrustUnit = (telemetry.thrustUnit === 'g') ? 'N' : 'g';
  document.getElementById('unitGrams').classList.toggle('active', telemetry.thrustUnit === 'g');
  document.getElementById('unitNewtons').classList.toggle('active', telemetry.thrustUnit === 'N');
  document.getElementById('lblThrustUnit').textContent = telemetry.thrustUnit;
  updateMetricDisplays();
}

function updatePowerCalc() {
  const sel = document.getElementById('batteryVoltageSelect');
  if (sel) telemetry.voltage = parseFloat(sel.value) || 11.1;
  telemetry.powerWatts = telemetry.currentAmps * telemetry.voltage;
  telemetry.efficiency = (telemetry.powerWatts > 0.5) 
    ? (telemetry.thrustGrams / telemetry.powerWatts) 
    : 0.0;
  updateMetricDisplays();
}

function tareLoadCell() {
  telemetry.zeroOffset = telemetry.raw;
  document.getElementById('valZeroOffset').textContent = Number(telemetry.zeroOffset).toLocaleString();
  showToast(`Tare calibrated! Zero baseline set to ${telemetry.zeroOffset}`, 'success');
  appendTerminalLine(`[TARE] Local zero baseline recalibrated to ${telemetry.zeroOffset}`, 'system-msg');
}

// ---------------------------------------------------------------------------
// 5. PARSE INCOMING ARDUINO SERIAL STREAM
// Format: "Raw: 86511 | Thrust: 245.5 g | Current: 3.42 A | RPM: 4200"
// ---------------------------------------------------------------------------
const SERIAL_REGEX = /Raw:\s*(-?\d+)\s*\|\s*Thrust:\s*([\d\.-]+)\s*g\s*\|\s*Current:\s*([\d\.-]+)\s*A\s*\|\s*RPM:\s*(\d+)/i;

function processSerialLine(rawLine) {
  if (!rawLine || rawLine.trim() === '') return;
  appendTerminalLine(rawLine.trim());

  const match = rawLine.match(SERIAL_REGEX);
  if (match) {
    const rawVal = parseInt(match[1], 10);
    const thrustVal = parseFloat(match[2]);
    const currentVal = parseFloat(match[3]);
    const rpmVal = parseInt(match[4], 10);

    applyTelemetryData(rawVal, thrustVal, currentVal, rpmVal);
  }
}

function applyTelemetryData(raw, thrustG, currentA, rpmVal) {
  telemetry.raw = raw;
  telemetry.thrustGrams = Math.max(0, thrustG);
  telemetry.currentAmps = Math.max(0, currentA);
  telemetry.rpm = Math.max(0, rpmVal);

  telemetry.powerWatts = telemetry.currentAmps * telemetry.voltage;
  telemetry.efficiency = (telemetry.powerWatts > 0.5) 
    ? (telemetry.thrustGrams / telemetry.powerWatts) 
    : 0.0;

  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  // Peak tracking
  if (telemetry.thrustGrams > peakValues.thrust) {
    peakValues.thrust = telemetry.thrustGrams;
    peakValues.thrustTime = timeStr;
  }
  if (telemetry.currentAmps > peakValues.current) {
    peakValues.current = telemetry.currentAmps;
    peakValues.currentTime = timeStr;
  }
  if (telemetry.rpm > peakValues.rpm) {
    peakValues.rpm = telemetry.rpm;
    peakValues.rpmTime = timeStr;
  }

  // Record historical sample
  const sample = {
    timestamp: timeStr,
    raw: telemetry.raw,
    thrust: telemetry.thrustGrams,
    thrustN: (telemetry.thrustGrams * 0.00980665).toFixed(2),
    current: telemetry.currentAmps,
    power: telemetry.powerWatts.toFixed(1),
    rpm: telemetry.rpm,
    eff: telemetry.efficiency.toFixed(1)
  };

  telemetryHistory.unshift(sample);
  if (telemetryHistory.length > MAX_HISTORY_RECORDS) {
    telemetryHistory.pop();
  }

  updateMetricDisplays();
  appendTableRecord(sample);
  pushChartSample(timeStr, telemetry.thrustGrams, telemetry.currentAmps, telemetry.rpm);
}

// ---------------------------------------------------------------------------
// 6. UI UPDATES & DIGITAL GAUGES
// ---------------------------------------------------------------------------
function updateMetricDisplays() {
  // 1. Thrust
  const thrustEl = document.getElementById('valThrust');
  const thrustBar = document.getElementById('barThrust');
  const thrustNewtons = (telemetry.thrustGrams * 0.00980665).toFixed(2);
  
  if (telemetry.thrustUnit === 'g') {
    thrustEl.textContent = telemetry.thrustGrams.toFixed(1);
  } else {
    thrustEl.textContent = thrustNewtons;
  }
  document.getElementById('valThrustNewtons').textContent = `${thrustNewtons} N`;
  document.getElementById('peakThrust').textContent = `${peakValues.thrust.toFixed(1)} g`;
  // Gauge bar (assuming 1500g max rating)
  const thrustPct = Math.min(100, (telemetry.thrustGrams / 1500) * 100);
  thrustBar.style.width = `${thrustPct}%`;

  // 2. Load Raw
  document.getElementById('valRaw').textContent = Number(telemetry.raw).toLocaleString();
  const rawDelta = telemetry.raw - telemetry.zeroOffset;
  const deltaEl = document.getElementById('loadDelta');
  deltaEl.textContent = (rawDelta >= 0 ? `+${rawDelta}` : `${rawDelta}`);
  const rawPct = Math.min(100, Math.max(0, ((telemetry.raw - 50000) / 100000) * 100));
  document.getElementById('barRaw').style.width = `${rawPct}%`;

  // 3. Current & Power
  document.getElementById('valCurrent').textContent = telemetry.currentAmps.toFixed(2);
  document.getElementById('valPower').textContent = `${telemetry.powerWatts.toFixed(1)} W`;
  document.getElementById('peakCurrentChip').textContent = `Peak: ${peakValues.current.toFixed(2)} A`;
  const currPct = Math.min(100, (telemetry.currentAmps / 20) * 100);
  document.getElementById('barCurrent').style.width = `${currPct}%`;

  // 4. RPM
  document.getElementById('valRPM').textContent = telemetry.rpm.toLocaleString();
  document.getElementById('peakRPM').textContent = `${peakValues.rpm.toLocaleString()} RPM`;
  const freqHz = (telemetry.rpm / 60).toFixed(1);
  document.getElementById('valFreq').textContent = `${freqHz} Hz`;
  const rpmPct = Math.min(100, (telemetry.rpm / 12000) * 100);
  document.getElementById('barRPM').style.width = `${rpmPct}%`;
  document.getElementById('efficiencyChip').innerHTML = `<i class="fa-solid fa-leaf"></i> ${telemetry.efficiency.toFixed(1)} g/W`;

  // Motor stage animation & specs
  updatePropellerAnimation(telemetry.rpm);
  document.getElementById('aeroEff').textContent = `${telemetry.efficiency.toFixed(1)} g/W`;
  // Estimated tip speed for standard 8-inch propeller (0.2032 m dia)
  // v = pi * D * (RPM/60)
  const tipSpeed = (Math.PI * 0.2032 * (telemetry.rpm / 60)).toFixed(1);
  document.getElementById('tipSpeed').textContent = `${tipSpeed} m/s`;
  // Thrust to weight ratio assumption (approx 200g motor+rig weight)
  const twRatio = (telemetry.thrustGrams / 200).toFixed(2);
  document.getElementById('thrustRatio').textContent = `${twRatio}x`;

  // History slide max summary
  document.getElementById('histMaxThrust').innerHTML = `${peakValues.thrust.toFixed(1)} <span class="unit">g</span>`;
  document.getElementById('histMaxThrustTime').textContent = `at ${peakValues.thrustTime}`;
  document.getElementById('histMaxCurrent').innerHTML = `${peakValues.current.toFixed(2)} <span class="unit">A</span>`;
  document.getElementById('histMaxCurrentTime').textContent = `at ${peakValues.currentTime}`;
  document.getElementById('histMaxRPM').innerHTML = `${peakValues.rpm.toLocaleString()} <span class="unit">RPM</span>`;
  document.getElementById('histMaxRPMTime').textContent = `at ${peakValues.rpmTime}`;

  // Average efficiency
  if (telemetryHistory.length > 0) {
    const sumEff = telemetryHistory.reduce((acc, cur) => acc + parseFloat(cur.eff || 0), 0);
    const avgEff = (sumEff / telemetryHistory.length).toFixed(1);
    document.getElementById('histAvgEfficiency').innerHTML = `${avgEff} <span class="unit">g/W</span>`;
  }
}

function updatePropellerAnimation(rpm) {
  const hub = document.getElementById('propellerHub');
  const rotorRing = document.getElementById('rotorGlow');
  const navProp = document.getElementById('navPropIcon');

  if (rpm <= 50) {
    hub.style.animationPlayState = 'paused';
    rotorRing.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.1)';
  } else {
    hub.style.animationPlayState = 'running';
    // Dynamic spin duration based on RPM (clamped between 0.05s and 1.5s)
    const revPerSec = Math.max(1, rpm / 60);
    const duration = Math.max(0.04, Math.min(1.5, 1 / revPerSec));
    hub.style.animationDuration = `${duration}s`;
    
    // Glowing aura intensity
    const glowIntensity = Math.min(45, 10 + (rpm / 300));
    rotorRing.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 240, 255, 0.65)`;
    if (navProp) {
      navProp.style.animationDuration = `${Math.max(0.2, duration * 2)}s`;
    }
  }
}

// ---------------------------------------------------------------------------
// 7. WEB SERIAL API (Direct 9600-Baud USB connection from Chrome/Edge)
// ---------------------------------------------------------------------------
let serialPort = null;
let serialReader = null;
let keepReading = false;

async function toggleHardwareConnection() {
  if (serialPort) {
    await disconnectSerial();
  } else {
    await connectSerial();
  }
}

async function connectSerial() {
  if (!('serial' in navigator)) {
    showToast('Web Serial API not supported in this browser. Please use Chrome or Edge.', 'error');
    appendTerminalLine('[ERROR] Web Serial API is unavailable. Try Google Chrome or MS Edge, or use Simulator Mode.', 'error-msg');
    return;
  }

  try {
    // Prompt user to select Arduino COM port
    serialPort = await navigator.serial.requestPort();
    // Open port with Arduino code configuration (9600 baud)
    await serialPort.open({ baudRate: 9600 });

    keepReading = true;
    updateConnectionUI(true, false);
    showToast('Arduino UNO Connected at 9600 Baud!', 'success');
    appendTerminalLine('[SERIAL] USB Port opened successfully at 9600 baud.', 'success-msg');

    readSerialLoop();
  } catch (err) {
    console.error('Serial connection error:', err);
    showToast(`Serial error: ${err.message}`, 'error');
    appendTerminalLine(`[ERROR] Connection failed: ${err.message}`, 'error-msg');
    updateConnectionUI(false, false);
  }
}

async function readSerialLoop() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
  serialReader = reader;

  let lineBuffer = '';

  try {
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        lineBuffer += value;
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop(); // Retain remainder
        for (const line of lines) {
          processSerialLine(line);
        }
      }
    }
  } catch (error) {
    console.warn('Serial stream interrupted:', error);
  } finally {
    reader.releaseLock();
  }
}

async function disconnectSerial() {
  keepReading = false;
  if (serialReader) {
    await serialReader.cancel();
  }
  if (serialPort) {
    await serialPort.close();
    serialPort = null;
  }
  updateConnectionUI(false, false);
  showToast('Arduino disconnected.', 'info');
  appendTerminalLine('[SERIAL] Port closed.', 'system-msg');
}

function updateConnectionUI(connected, simulated) {
  const btn = document.getElementById('serialConnectBtn');
  const btnText = document.getElementById('serialBtnText');
  const badge = document.getElementById('connectionBadge');
  const badgeText = document.getElementById('connectionStatusText');

  badge.className = 'status-indicator-badge';

  if (connected) {
    btn.classList.add('connected');
    btnText.setAttribute('data-i18n', 'btn_disconnect_arduino');
    btnText.textContent = (i18n[currentLang] && i18n[currentLang].btn_disconnect_arduino) || 'Disconnect';
    badge.classList.add('connected');
    badgeText.setAttribute('data-i18n', 'status_connected');
    badgeText.textContent = (i18n[currentLang] && i18n[currentLang].status_connected) || 'Hardware Active';
  } else if (simulated) {
    btn.classList.remove('connected');
    btnText.setAttribute('data-i18n', 'btn_connect_arduino');
    btnText.textContent = (i18n[currentLang] && i18n[currentLang].btn_connect_arduino) || 'Connect Arduino';
    badge.classList.add('simulated');
    badgeText.setAttribute('data-i18n', 'status_simulated');
    badgeText.textContent = (i18n[currentLang] && i18n[currentLang].status_simulated) || 'Simulator Running';
  } else {
    btn.classList.remove('connected');
    btnText.setAttribute('data-i18n', 'btn_connect_arduino');
    btnText.textContent = (i18n[currentLang] && i18n[currentLang].btn_connect_arduino) || 'Connect Arduino';
    badge.classList.add('disconnected');
    badgeText.setAttribute('data-i18n', 'status_standby');
    badgeText.textContent = (i18n[currentLang] && i18n[currentLang].status_standby) || 'Standby';
  }
}

// ---------------------------------------------------------------------------
// 8. BUILT-IN REALISTIC SIMULATOR (BLDC Motor Aerodynamics Engine)
// ---------------------------------------------------------------------------
let isSimMode = false;
let simInterval = null;
let currentThrottle = 0;

function toggleSimMode(forceState) {
  isSimMode = (typeof forceState === 'boolean') ? forceState : !isSimMode;
  const toggleBtn = document.getElementById('simToggleBtn');
  const simDock = document.getElementById('simControlDock');
  const simText = document.getElementById('simModeText');

  if (isSimMode) {
    toggleBtn.classList.add('active');
    simText.textContent = 'SIM: ON';
    simDock.style.display = 'block';
    updateConnectionUI(false, true);
    showToast('Simulation Mode activated! Adjust throttle slider below.', 'info');
    appendTerminalLine('[SIMULATOR] Virtual BLDC Motor initialized. Physics loop running.', 'system-msg');
    
    // Auto ramp up to 40% if idle so user sees immediate results
    if (currentThrottle === 0) {
      updateThrottle(45);
      document.getElementById('throttleSlider').value = 45;
    }

    startSimLoop();
  } else {
    toggleBtn.classList.remove('active');
    simText.textContent = 'SIM: OFF';
    simDock.style.display = 'none';
    clearInterval(simInterval);
    simInterval = null;
    updateConnectionUI(false, false);
    appendTerminalLine('[SIMULATOR] Virtual motor stopped.', 'system-msg');
    // Reset to idle
    applyTelemetryData(86511, 0, 0, 0);
  }
}

function updateThrottle(val) {
  currentThrottle = parseInt(val, 10);
  document.getElementById('throttleVal').textContent = `${currentThrottle}%`;
}

function startSimLoop() {
  if (simInterval) clearInterval(simInterval);

  simInterval = setInterval(() => {
    if (!isSimMode) return;

    // BLDC Physics model:
    // Max RPM ~ 10,500 at 100% throttle
    // Thrust roughly proportional to RPM^2
    // Current proportional to Throttle^1.5 + base idle
    const noise = (Math.random() - 0.5) * 0.05;
    const throttleRatio = currentThrottle / 100;

    let targetRPM = 0;
    let targetThrust = 0;
    let targetCurrent = 0;

    if (currentThrottle > 0) {
      targetRPM = Math.round((throttleRatio * 9800) * (1 + noise * 0.4));
      // Thrust in grams: ~ 1250g max
      targetThrust = parseFloat(((Math.pow(throttleRatio, 1.85) * 1150) * (1 + noise)).toFixed(1));
      // Current in Amperes: ~ 14.5A max
      targetCurrent = parseFloat(((0.3 + Math.pow(throttleRatio, 1.6) * 13.8) * (1 + noise * 0.5)).toFixed(2));
    }

    // Raw HX711 Load Cell simulation:
    // raw = ZERO_VALUE + (weight * SCALE_FACTOR)
    const simulatedRaw = Math.round(86511 + (targetThrust * 68.81) + ((Math.random() - 0.5) * 20));

    // Emit serial format like Arduino
    const simLine = `Raw: ${simulatedRaw} | Thrust: ${targetThrust.toFixed(1)} g | Current: ${targetCurrent.toFixed(2)} A | RPM: ${targetRPM}`;
    processSerialLine(simLine);

  }, 500); // 500ms matching Arduino delay
}

// ---------------------------------------------------------------------------
// 9. TERMINAL EMULATOR
// ---------------------------------------------------------------------------
let autoScroll = true;

function appendTerminalLine(text, cssClass = '') {
  const terminal = document.getElementById('serialTerminal');
  if (!terminal) return;

  const lineEl = document.createElement('div');
  lineEl.className = `terminal-line ${cssClass}`;
  const time = new Date().toLocaleTimeString();
  lineEl.textContent = `[${time}] ${text}`;
  terminal.appendChild(lineEl);

  // Keep terminal tidy
  while (terminal.childElementCount > 100) {
    terminal.removeChild(terminal.firstChild);
  }

  if (autoScroll) {
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function clearTerminal() {
  const terminal = document.getElementById('serialTerminal');
  if (terminal) {
    terminal.innerHTML = '<div class="terminal-line system-msg">[SYSTEM] Terminal cleared.</div>';
  }
}

function toggleAutoScroll() {
  autoScroll = !autoScroll;
  const btn = document.getElementById('autoScrollBtn');
  btn.textContent = `Auto-Scroll: ${autoScroll ? 'ON' : 'OFF'}`;
}

// ---------------------------------------------------------------------------
// 10. HISTORY LOG TABLE & CSV EXPORT
// ---------------------------------------------------------------------------
function appendTableRecord(sample) {
  const tbody = document.getElementById('telemetryTableBody');
  const countBadge = document.getElementById('tableRecordCount');
  if (!tbody) return;

  // Remove empty row placeholder if present
  const emptyRow = tbody.querySelector('.empty-row');
  if (emptyRow) emptyRow.remove();

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${sample.timestamp}</td>
    <td>${Number(sample.raw).toLocaleString()}</td>
    <td class="text-cyan">${sample.thrust}</td>
    <td>${sample.thrustN}</td>
    <td class="text-amber">${sample.current}</td>
    <td>${sample.power}</td>
    <td class="text-green">${Number(sample.rpm).toLocaleString()}</td>
    <td class="text-purple">${sample.eff}</td>
  `;

  tbody.insertBefore(tr, tbody.firstChild);

  // Limit table rows in DOM
  while (tbody.childElementCount > 150) {
    tbody.removeChild(tbody.lastChild);
  }

  if (countBadge) {
    countBadge.textContent = `${telemetryHistory.length} Records Recorded`;
  }
}

function clearTelemetryHistory() {
  if (confirm('Are you sure you want to clear telemetry history logs and reset charts?')) {
    telemetryHistory = [];
    peakValues = {
      thrust: 0.0,
      thrustTime: '--:--:--',
      current: 0.0,
      currentTime: '--:--:--',
      rpm: 0,
      rpmTime: '--:--:--'
    };

    const tbody = document.getElementById('telemetryTableBody');
    if (tbody) {
      tbody.innerHTML = `
        <tr class="empty-row">
          <td colspan="8" data-i18n="table_empty">No telemetry samples recorded yet. Connect Arduino or start Simulator to capture data.</td>
        </tr>`;
    }
    const countBadge = document.getElementById('tableRecordCount');
    if (countBadge) countBadge.textContent = '0 Records Recorded';

    resetCharts();
    updateMetricDisplays();
    showToast('Telemetry history cleared.', 'info');
  }
}

function exportDataCSV() {
  if (telemetryHistory.length === 0) {
    showToast('No telemetry data available to export.', 'error');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Timestamp,Raw ADC,Thrust (g),Thrust (N),Current (A),Power (W),RPM,Efficiency (g/W)\r\n';

  // Export in chronological order
  const chronological = [...telemetryHistory].reverse();
  chronological.forEach(row => {
    csvContent += `"${row.timestamp}",${row.raw},${row.thrust},${row.thrustN},${row.current},${row.power},${row.rpm},${row.eff}\r\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  link.setAttribute('download', `bldc_telemetry_log_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${telemetryHistory.length} data rows to CSV!`, 'success');
}

// ---------------------------------------------------------------------------
// 11. CHART.JS REAL-TIME TELEMETRY CHARTS
// ---------------------------------------------------------------------------
let chartThrust = null;
let chartCurrent = null;
let chartRPM = null;
let chartsInitialized = false;

const MAX_CHART_POINTS = 25;

function initChartsIfNeeded() {
  if (chartsInitialized) return;

  const ctxThrust = document.getElementById('chartThrust')?.getContext('2d');
  const ctxCurrent = document.getElementById('chartCurrent')?.getContext('2d');
  const ctxRPM = document.getElementById('chartRPM')?.getContext('2d');

  if (!ctxThrust || !ctxCurrent || !ctxRPM) return;

  // Chart defaults for futuristic dark glass look
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = 'Rajdhani, sans-serif';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { maxTicksLimit: 8, font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        beginAtZero: true
      }
    }
  };

  // 1. Thrust Chart
  chartThrust = new Chart(ctxThrust, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Thrust (g)',
        data: [],
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },
    options: commonOptions
  });

  // 2. Current Chart
  chartCurrent = new Chart(ctxCurrent, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Current (A)',
        data: [],
        borderColor: '#ffaa00',
        backgroundColor: 'rgba(255, 170, 0, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },
    options: commonOptions
  });

  // 3. RPM Chart
  chartRPM = new Chart(ctxRPM, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'RPM',
        data: [],
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5
      }]
    },
    options: commonOptions
  });

  chartsInitialized = true;
}

function pushChartSample(timeLabel, thrust, current, rpm) {
  if (!chartsInitialized) return;

  [chartThrust, chartCurrent, chartRPM].forEach(chart => {
    if (!chart) return;
    if (chart.data.labels.length >= MAX_CHART_POINTS) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
  });

  chartThrust.data.labels.push(timeLabel);
  chartThrust.data.datasets[0].data.push(thrust);
  chartThrust.update('none');

  chartCurrent.data.labels.push(timeLabel);
  chartCurrent.data.datasets[0].data.push(current);
  chartCurrent.update('none');

  chartRPM.data.labels.push(timeLabel);
  chartRPM.data.datasets[0].data.push(rpm);
  chartRPM.update('none');
}

function resetCharts() {
  [chartThrust, chartCurrent, chartRPM].forEach(chart => {
    if (chart) {
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.update();
    }
  });
}

// ---------------------------------------------------------------------------
// 12. TOAST NOTIFICATIONS HELPER
// ---------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---------------------------------------------------------------------------
// 13. OPTIONAL WEBSOCKET CLIENT (For Render / Local Node.js Backend)
// ---------------------------------------------------------------------------
let backendWs = null;

function connectBackendWebSocket() {
  if (window.location.protocol.startsWith('http')) {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProto}//${window.location.host}`;
    
    try {
      backendWs = new WebSocket(wsUrl);
      backendWs.onopen = () => {
        console.log('[WS] Connected to backend telemetry server at', wsUrl);
      };
      backendWs.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'TELEMETRY' && payload.data && !serialPort && !isSimMode) {
            const d = payload.data;
            applyTelemetryData(d.raw || 86511, d.thrust || 0, d.current || 0, d.rpm || 0);
          }
        } catch (e) {
          // Non-JSON message ignored
        }
      };
    } catch (err) {
      console.log('[WS] Optional backend WebSocket not active.');
    }
  }
}

// ---------------------------------------------------------------------------
// 14. INITIALIZATION ON PAGE LOAD
// ---------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // Load saved language preference or default to English
  const savedLang = localStorage.getItem('bldc_lang_pref') || 'en';
  applyLanguage(savedLang);

  // Check login state (remember me)
  checkExistingAuth();

  // Try connecting to backend WebSocket (if running on Render / Node.js)
  connectBackendWebSocket();
});
