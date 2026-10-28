/*
 * =========================================================================
 * S5 MINI PROJECT: BLDC MOTOR THRUST & PERFORMANCE TEST STAND
 * Hardware: Arduino UNO, HX711 Load Cell, ACS712 (20A) Current Sensor,
 *           IR Optical RPM Sensor (Pin D2 Interrupt), 16x2 I2C LCD Display
 * Output: 16x2 LCD + USB Serial (9600 Baud)
 * Format: "Raw: <raw> | Thrust: <weight> g | Current: <current> A | RPM: <rpm>"
 * =========================================================================
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "HX711.h"

#define HX_DT   4
#define HX_SCK  5
#define ACS_PIN A0
#define IR_PIN  2

HX711 scale;
LiquidCrystal_I2C lcd(0x27, 16, 2);   // change to 0x3F if your I2C backpack uses 0x3F

// -------- Load Cell Calibration --------
long  ZERO_VALUE   = 86511;
float SCALE_FACTOR = 68.81;

// -------- ACS712 (20A) Current Sensor --------
const float ACS_OFFSET      = 2.50;  // 2.5V zero-current offset for 5V supply
const float ACS_SENSITIVITY = 0.100; // 100 mV/A for 20A module (66mV for 30A, 185mV for 5A)

// -------- RPM Optical Sensor --------
const unsigned int PULSES_PER_REV = 2;   // pulses per one rotation (e.g. 2-blade prop or 2 reflective marks)
volatile unsigned long pulseCount = 0;
unsigned long lastRPMTime = 0;
unsigned int rpm = 0;

unsigned long lastDisplayTime = 0;
float weight = 0;
float current = 0;
long raw = 0;

void countPulse()
{
  pulseCount++;
}

void setup()
{
  Serial.begin(9600);

  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("BLDC TEST STAND");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");

  scale.begin(HX_DT, HX_SCK);

  pinMode(IR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(IR_PIN), countPulse, FALLING);

  delay(2000);
  lcd.clear();

  Serial.println("BLDC THRUST TEST STAND READY");
  lastRPMTime = millis();
}

void loop()
{
  // ---- Weight / Thrust via HX711 ----
  if (scale.is_ready())
  {
    raw = scale.read_average(5);
    weight = (raw - ZERO_VALUE) / SCALE_FACTOR;
    if (weight < 0) weight = 0;
  }

  // ---- Current via ACS712 (Average 100 samples) ----
  long adc = 0;
  for (int i = 0; i < 100; i++)
  {
    adc += analogRead(ACS_PIN);
  }
  adc /= 100;

  float voltage = adc * (5.0 / 1023.0);
  current = (voltage - ACS_OFFSET) / ACS_SENSITIVITY;
  if (current < 0.1) current = 0;

  // ---- RPM Calculation (Calculated every 1000ms) ----
  unsigned long now = millis();
  unsigned long elapsed = now - lastRPMTime;

  if (elapsed >= 1000)
  {
    noInterrupts();
    unsigned long pulses = pulseCount;
    pulseCount = 0;
    interrupts();

    rpm = (pulses * 60000UL) / (elapsed * PULSES_PER_REV);
    lastRPMTime = now;
  }

  // ---- Display and Serial Telemetry every 500 ms ----
  if (now - lastDisplayTime >= 500)
  {
    lastDisplayTime = now;

    // Send formatted telemetry line to Serial (parsed by Web Application)
    Serial.print("Raw: ");          Serial.print(raw);
    Serial.print(" | Thrust: ");    Serial.print(weight, 1);
    Serial.print(" g | Current: "); Serial.print(current, 2);
    Serial.print(" A | RPM: ");     Serial.println(rpm);

    // Update 16x2 I2C LCD
    lcd.setCursor(0, 0);
    lcd.print("Thrust:");
    lcd.print(weight, 0);
    lcd.print("g      ");

    lcd.setCursor(0, 1);
    lcd.print("I:");
    lcd.print(current, 1);
    lcd.print("A R:");
    lcd.print(rpm);
    lcd.print("      ");
  }
}
