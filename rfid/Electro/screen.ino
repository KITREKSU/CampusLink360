void title()
{
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(20, 12);
  display.println(F("ELECTRO"));
  display.setCursor(20, 38);
  display.println(F("CHARGER"));
  display.display();
  delay(2000);
}
void screen1()
{
  timeUpdate();
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(0, 4);
  if(LCD_Status == 0)
  {
    display.println(F("LOW BALANCE"));
  }
  else if(LCD_Status == 1)
  {
    display.println(F("NOT CHARGING"));
  }
  else if(LCD_Status == 2)
  {
    display.println(F("CHARGING"));
    int charge = analogRead(chargingSense);
    int voltage = charge/100;
    display.setCursor(0, 28);
    display.print(voltage);
    display.println(F(" V"));
  }
  display.setCursor(16, 48);
  display.print(formattedTime);
  display.display();
}
