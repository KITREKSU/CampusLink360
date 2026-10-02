#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <SPI.h>
#include <MFRC522.h>

// WiFi
#define WIFI_SSID "tester"
#define WIFI_PASSWORD "12345678"

// CampusLink360 Firebase project
#define API_KEY "AIzaSyDqvuaWjmOsPnHRvSJAGcBChAXvFjzih4w"
#define DATABASE_URL "https://campuslink-8fb97-default-rtdb.firebaseio.com/"

// Add a Firebase Authentication user here if anonymous sign-in is not enabled.
#define USER_EMAIL "kitreksu@gmail.com"
#define USER_PASSWORD "asdf1234"

// ESP8266 NodeMCU pin labels
// RC522 SPI wiring: SCK D5, MISO D6, MOSI D7, SDA/SS D8
#define SS_PIN     D8
#define RST_PIN    D3
#define GREEN_LED  D1
#define RED_LED    D0
#define BUZZER     D2
#define WIFI_LED   LED_BUILTIN

const char SCANNER_PATH[] = "/Scanner/Hostel";
const unsigned long BUSY_POLL_INTERVAL_MS = 500;
const unsigned long RESCAN_DELAY_MS = 1000;

MFRC522 rfid(SS_PIN, RST_PIN);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool scannerBusy = false;
unsigned long lastBusyPoll = 0;
unsigned long lastScanMillis = 0;

void setScannerLights(bool busy)
{
  digitalWrite(RED_LED, busy ? HIGH : LOW);
  digitalWrite(GREEN_LED, busy ? LOW : HIGH);
}

void setWiFiLed(bool on)
{
  // NodeMCU built-in LED is usually active-low.
  digitalWrite(WIFI_LED, on ? LOW : HIGH);
}

void beep()
{
  digitalWrite(BUZZER, HIGH);
  delay(100);
  digitalWrite(BUZZER, LOW);
}

String readCardUid()
{
  String uid = "";

  for (byte i = 0; i < rfid.uid.size; i++)
  {
    if (rfid.uid.uidByte[i] < 0x10)
    {
      uid += "0";
    }

    uid += String(rfid.uid.uidByte[i], HEX);
  }

  uid.toUpperCase();
  return uid;
}

void connectWiFi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    setWiFiLed(true);
    delay(150);
    setWiFiLed(false);
    delay(150);
    Serial.print(".");
  }

  setWiFiLed(true);

  Serial.println();
  Serial.print("WiFi connected. IP: ");
  Serial.println(WiFi.localIP());
}

void connectFirebase()
{
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  if (strlen(USER_EMAIL) > 0 && strlen(USER_PASSWORD) > 0)
  {
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;
  }
  else
  {
    Serial.println("Using Firebase anonymous sign-in.");
    if (Firebase.signUp(&config, &auth, "", ""))
    {
      Serial.println("Firebase anonymous sign-in ok.");
    }
    else
    {
      Serial.printf("Firebase sign-in failed: %s\n", config.signer.signupError.message.c_str());
    }
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

bool readScannerBusy()
{
  String busyPath = String(SCANNER_PATH) + "/Busy";

  if (!Firebase.ready())
  {
    return scannerBusy;
  }

  if (Firebase.RTDB.getInt(&fbdo, busyPath))
  {
    scannerBusy = fbdo.intData() == 1;
    setScannerLights(scannerBusy);
  }
  else
  {
    Serial.print("Busy read failed: ");
    Serial.println(fbdo.errorReason());
  }

  return scannerBusy;
}

void initializeScannerState()
{
  String busyPath = String(SCANNER_PATH) + "/Busy";
  String uidPath = String(SCANNER_PATH) + "/UID";

  if (!Firebase.ready())
  {
    return;
  }

  if (!Firebase.RTDB.getInt(&fbdo, busyPath))
  {
    Firebase.RTDB.setInt(&fbdo, busyPath, 0);
  }

  if (!Firebase.RTDB.getString(&fbdo, uidPath))
  {
    Firebase.RTDB.setString(&fbdo, uidPath, "0");
  }

  readScannerBusy();
}

void publishCard(String uid)
{
  String busyPath = String(SCANNER_PATH) + "/Busy";
  String uidPath = String(SCANNER_PATH) + "/UID";

  scannerBusy = true;
  setScannerLights(true);

  Serial.print("Card UID: ");
  Serial.println(uid);

  if (!Firebase.ready())
  {
    Serial.println("Firebase is not ready. Card was not uploaded.");
    return;
  }

  bool uidOk = Firebase.RTDB.setString(&fbdo, uidPath, uid);
  bool busyOk = Firebase.RTDB.setInt(&fbdo, busyPath, 1);

  if (uidOk && busyOk)
  {
    Serial.println("Hostel scanner updated at Scanner/Hostel.");
  }
  else
  {
    Serial.print("Firebase update failed: ");
    Serial.println(fbdo.errorReason());
  }
}

void setup()
{
  Serial.begin(115200);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(WIFI_LED, OUTPUT);

  digitalWrite(BUZZER, LOW);
  setWiFiLed(false);
  setScannerLights(true);

  SPI.begin();
  rfid.PCD_Init();

  Serial.println();
  Serial.println("CampusLink360 Hostel RFID scanner");

  connectWiFi();
  connectFirebase();
  initializeScannerState();

  Serial.println("Ready. Scan a hostel card when the green LED is on.");
}

void loop()
{
  if (millis() - lastBusyPoll >= BUSY_POLL_INTERVAL_MS)
  {
    lastBusyPoll = millis();
    readScannerBusy();
  }

  if (scannerBusy || millis() - lastScanMillis < RESCAN_DELAY_MS)
  {
    return;
  }

  if (!rfid.PICC_IsNewCardPresent())
  {
    return;
  }

  if (!rfid.PICC_ReadCardSerial())
  {
    return;
  }

  lastScanMillis = millis();
  String uid = readCardUid();
  beep();
  publishCard(uid);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
