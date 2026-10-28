# ⚡ BLDC Motor Thrust & Performance Test Stand (S5 Mini Project)

An advanced, aerospace-grade real-time telemetry dashboard and hardware test stand for **Brushless DC (BLDC) Motors**. Built for electrical, robotics, and aerospace engineering test benches to measure **Thrust (g/N)**, **Load Cell Raw ADC**, **Current Consumption (A)**, and **Rotational Velocity (RPM)** via an **Arduino UNO**.

![BLDC Motor Thrust Test Stand](assets/bldc_thrust_stand.jpg)

---

## 🌟 Key Features

- **🔐 Persistent Login Screen**:
  - Secure authentication portal designed with glassmorphic aesthetics.
  - Automatically remembers authentication in `localStorage` — once logged in on your machine, it directly opens the dashboard.
  - Quick auto-fill button provided. Default credentials: `admin` / `thrust2026`.
- **🚀 4 Real-Time Telemetry Cards**:
  1. **Thrust Force**: Live reading in **Grams (g)** with instant toggle to **Newtons (N)**, peak tracking, and dynamic visual load gauge.
  2. **Raw Load Value**: 24-bit raw ADC counts directly from the **HX711** amplifier, with Tare / Re-Zero calibration.
  3. **Current Consumption**: Live reading in **Amperes (A)** from the **ACS712 (20A)** sensor, real-time power calculation ($P = V \times I$), and battery voltage selector (3S 11.1V, 4S 14.8V, 6S 22.2V).
  4. **Rotations Per Minute (RPM)**: Optical beam interrupt frequency and RPM counter with aerodynamic efficiency calculation (**g/W**).
- **🌀 Dynamic Propeller Visualizer**:
  - Glowing HUD visualizer with an animated carbon-fiber propeller that rotates in direct synchronization with the actual live RPM from the motor!
- **📊 Slide 2: Historical Telemetry & Analytics**:
  - Three real-time synchronization charts using **Chart.js**:
    - Thrust vs Time
    - Current vs Time
    - RPM & Power vs Time
  - Statistical summary badges: Peak Thrust, Peak Current, Peak RPM, and Average Aerodynamic Efficiency.
  - Historical data log table with timestamps and **Export to CSV** functionality for laboratory report generation.
- **🌐 Multilingual Support (6 Languages)**:
  - Instant one-click language toggle across the entire portal:
    - 🇺🇸 **English (EN)**
    - 🇮🇳 **தமிழ் (Tamil - TA)**
    - 🇮🇳 **हिन्दी (Hindi - HI)**
    - 🇪🇸 **Español (Spanish - ES)**
    - 🇩🇪 **Deutsch (German - DE)**
    - 🇫🇷 **Français (French - FR)**
- **🔌 Hardware & Cloud Connectivity**:
  - **Direct USB Web Serial API**: Chrome & Edge can read the Arduino UNO COM port directly at 9600 baud without installing any local server!
  - **Full-Stack Node.js / WebSocket Server**: Ready for deployment to **Render** (`server.js`).
  - **Realistic Aerodynamic Simulator**: Built-in interactive simulator mode with a throttle slider (0% to 100%) so examiners and reviewers can experience the dashboard even without physical hardware plugged in!

---

## 🛠️ Hardware Wiring & Pin Configuration

| Component | Arduino Pin | Description |
| :--- | :--- | :--- |
| **HX711 Load Cell DT** | `Digital Pin 4` | Serial Data Output from Load Cell ADC |
| **HX711 Load Cell SCK** | `Digital Pin 5` | Serial Clock Input |
| **ACS712 Current Sensor** | `Analog Pin A0` | Analog Voltage Output (100 mV/A sensitivity) |
| **IR Optical Speed Sensor** | `Digital Pin 2 (INT0)` | Hardware Interrupt pin counting pulses per revolution |
| **16x2 I2C LCD SDA** | `Analog Pin A4` | I2C Data (Address `0x27` or `0x3F`) |
| **16x2 I2C LCD SCL** | `Analog Pin A5` | I2C Clock |
| **VCC & GND** | `5V & GND` | Regulated 5V Rail from Arduino UNO |

---

## 💻 Arduino Firmware (`arduino/bldc_thrust_stand.ino`)

The Arduino continuously reads the sensors and transmits formatted telemetry over USB Serial at **9600 baud** every 500 ms:
```text
Raw: 86511 | Thrust: 245.5 g | Current: 3.42 A | RPM: 4200
```
This is simultaneously shown on the 16x2 LCD display and parsed in real time by the web application.

---

## 🚀 How to Connect Hardware to Software

### Method 1: Direct USB Web Serial API (Recommended & Instant!)
1. Plug your **Arduino UNO** into your laptop via USB.
2. Open the website in **Google Chrome** or **Microsoft Edge** (local or hosted on **Vercel** with HTTPS).
3. Click the cyan **"Connect Arduino"** button in the top navigation bar.
4. Select your Arduino COM Port (e.g., `COM3` or `COM4`) and click **Connect**.
5. The dashboard immediately starts streaming live thrust, current, load, and RPM data!

### Method 2: Node.js Backend Server (for Render / Local Server)
1. Run `npm install` and `npm start`.
2. The server starts at `http://localhost:3000`.
3. Telemetry can also be relayed via WebSocket or REST API at `POST /api/telemetry`.

---

## 📦 How to Push to GitHub (`naveenkumarnee24-png`)

1. Open your terminal in this project directory:
   ```bash
   cd "c:\Users\sudha\OneDrive\Desktop\S5 MINI PROJECT- THRUST WITH BLCD MOTOR"
   ```
2. Create a new repository on your GitHub account (`https://github.com/new`) named:
   `BLDC-Motor-Thrust-Stand`
3. Initialize and push your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete BLDC Motor Thrust Test Stand telemetry portal"
   git branch -M main
   git remote add origin https://github.com/naveenkumarnee24-png/BLDC-Motor-Thrust-Stand.git
   git push -u origin main
   ```

---

## ⚡ How to Deploy to Vercel (Frontend Telemetry Portal)

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Import the `BLDC-Motor-Thrust-Stand` repository from `naveenkumarnee24-png`.
4. In the configuration step:
   - Framework Preset: **Other**
   - Root Directory: `./`
5. Click **"Deploy"**.
6. Within 30 seconds, Vercel gives you a live HTTPS URL (e.g., `https://bldc-thrust-stand.vercel.app`)!
   > **Note**: Because Vercel provides automatic HTTPS, the **Web Serial API** works natively right in the browser!

---

## ☁️ How to Deploy to Render (Backend Web Service)

1. Go to [https://render.com](https://render.com) and sign in with your GitHub account.
2. Click **"New +"** -> **"Web Service"**.
3. Select your repository `BLDC-Motor-Thrust-Stand`.
4. Set the configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Create Web Service"**. Render will deploy the Express + WebSocket server!

---

## 👨‍💻 Project Information

- **Course**: S5 Mini Project (Electrical & Electronics / Robotics & Automation)
- **Title**: BLDC Motor Thrust with Microcontroller Telemetry Test Stand
- **Hardware**: Arduino UNO, HX711 24-Bit ADC, ACS712-20A Hall Current Sensor, Infrared Optical RPM Sensor, 16x2 I2C LCD
- **Developer**: [naveenkumarnee24-png](https://github.com/naveenkumarnee24-png)
