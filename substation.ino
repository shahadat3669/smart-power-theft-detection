#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <Arduino_JSON.h>

const char *ssid = "Shahadat";
const char *password = "12301230";
const char* serverName = "http://192.168.43.43:8000/api/v1/stations/update";
unsigned long lastTime = 0;
unsigned long timerDelay = 2000;

const int sensorIn = A0;
int mVperAmp = 185;
double Voltage = 0;
double VRMS = 0;
double AmpsRMS = 0;
float Wattage = 0;

void setup() {
  Serial.begin(9600);
  pinMode(A0, INPUT);
  Serial.println("Connecting...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      collectData();
      httpPOSTRequest();
     
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
void collectData(){
  Voltage = getVPP();
  VRMS = (Voltage / 2.0) * 0.707; // sq root
  AmpsRMS = (VRMS * 1000) / mVperAmp;
  Wattage = (220 * AmpsRMS) - 18;
}


float getVPP()
{
  float result;

  int readValue;             //value read from the sensor
  int maxValue = 0;          // store max value here
  int minValue = 1024;          // store min value here

  uint32_t start_time = millis();

  while ((millis() - start_time) < 1000) //sample for 1 Sec
  {
    readValue = analogRead(sensorIn);
    // see if you have a new maxValue
    if (readValue > maxValue)
    {
      /*record the maximum sensor value*/
      maxValue = readValue;
    }
    if (readValue < minValue)
    {
      /*record the maximum sensor value*/
      minValue = readValue;
    }
    /*       Serial.print(readValue);
           Serial.println(" readValue ");
           Serial.print(maxValue);
           Serial.println(" maxValue ");
           Serial.print(minValue);
           Serial.println(" minValue ");
           delay(1000); */
  }

  // Subtract min from max
  result = ((maxValue - minValue) * 5) / 1024.0;
  return result;


}


void httpPOSTRequest() {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, serverName);
  //http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  http.addHeader("Content-Type", "application/json");
  String httpRequestData;

  StaticJsonDocument<768> doc;
  JsonArray documents = doc.createNestedArray("documents");
  JsonObject amp = documents.createNestedObject();
  amp["_id"] = "629b4c27d818008e3048db18";
  amp["value"] = AmpsRMS;

  JsonObject wattage = documents.createNestedObject();
  wattage["_id"] = "629b4c30d818008e3048db1a";
  wattage["value"] = Wattage;

 
  serializeJson(doc, httpRequestData);
  int httpResponseCode = http.POST(httpRequestData);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  Serial.println(http.errorToString(httpResponseCode).c_str());
  
  http.end();

}
