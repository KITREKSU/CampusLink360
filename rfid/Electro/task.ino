void wifiConnect()
{
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 12);
  display.println(F("Waiting for WiFi"));
  display.display();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  delay(1000);
  Serial.println("Waiting for WiFi !");
  int dotX = 0;
  while ((!(WiFi.status() == WL_CONNECTED)))
  {
    Serial.println(".");
    display.setCursor(dotX, 30);
    display.print('.');
    display.display();
    dotX += 6;
    if (dotX >= SCREEN_WIDTH)
    {
      dotX = 0;
      display.clearDisplay();
      display.setCursor(0, 12);
      display.println(F("Waiting for WiFi"));
    }
    delay(300);
  }
  
  Serial.println("WiFi Connected Successfully !");
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(15, 12);
  display.println(F("Connected"));
  display.setTextSize(1);
  display.setCursor(22, 42);
  display.println(F("System @Online"));
  display.display();
  delay(1000);
}
void checkBalance()
{
  if (Firebase.RTDB.getString(&fbdo, "/balance"))
  {
    String balanceValue = fbdo.stringData();
    balance =balanceValue.toInt();
    if(balance == 0)
    {
      LCD_Status = 0;
      Serial.println("No Wallet Balance");
      digitalWrite(chargingRelay,LOW);
    }
    else
    {
      LCD_Status = 1;
      Serial.println("Charging Allowed");
      digitalWrite(chargingRelay,HIGH);
    }
  }
}
void chargingMode()
{
  Serial.println(analogRead(chargingSense));
  if(LCD_Status != 0)
  {
    if(analogRead(chargingSense) < 100)
    {
      
      LCD_Status = 1;
      Firebase.RTDB.setInt(&fbdo, F("Charging"), 0);
      Serial.println("Not Charging");
    }
    else
    {
      LCD_Status = 2;
      Firebase.RTDB.setInt(&fbdo, F("Charging"), 1);
      Serial.println("Charging");
    }
  }
}
void timeUpdate()
{
  timeClient.update();
 
  unsigned long epochTime = timeClient.getEpochTime();
   
  formattedTime = timeClient.getFormattedTime();
}
