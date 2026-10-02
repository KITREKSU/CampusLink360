#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define WIFI_SSID "tester"
#define WIFI_PASSWORD "12345678"

#define API_KEY "AIzaSyCFwG7211v5Lgs4qO1ViMs5XQ4bNchuaWs"
#define USER_EMAIL "nandanasuneesh2@gmail.com"
#define USER_PASSWORD "asd123*"
#define DATABASE_URL "https://electro-642a2-default-rtdb.firebaseio.com/"

#define chargingSense A0

#define chargingRelay D8

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

int charging = 0;
int balance = 0;
int LCD_Status = 0;

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define OLED_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WiFiUDP ntpUDP;

NTPClient timeClient(ntpUDP, "pool.ntp.org",19800);

String formattedTime,currentDate;
 
void setup() 
{
  Serial.begin(115200);
  pinMode(chargingRelay, OUTPUT);
  pinMode(chargingSense, INPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS))
  {
    Serial.println(F("SSD1306 allocation failed"));
    while (true) { delay(1); }
  }
  
  title();

  wifiConnect();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  timeClient.begin();
  display.clearDisplay();
  display.display();
}
void loop() 
{
  checkBalance();
  chargingMode();
  timeUpdate();
  screen1();
}
