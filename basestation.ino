#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <Arduino_JSON.h>

const char *ssid = "Shahadat";
const char *password = "12301230";
const char* serverName = "http://192.168.43.43:8000/api/v1/stations/update";
const char* subServerName = "http://192.168.43.43:8000/api/v1/stations/sub";
unsigned long lastTime = 0;
unsigned long timerDelay = 2000;

const int sensorIn = A0;
int mVperAmp = 185;
double Voltage = 0;
double VRMS = 0;
double AmpsRMS = 0;
double Wattage = 0;
double subAmp = 0;
double subWattage = 0;
double differenceData = 0;
String dataRead;
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
      dataRead = httpGETRequest(subServerName);
      workWithGet();
      collectData();
      httpPOSTRequest();

    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

void workWithGet() {
  JSONVar myObject = JSON.parse(dataRead);
  if (JSON.typeof(myObject) == "undefined") {
    Serial.println("Parsing input failed!");
    return;
  }
  subAmp =  myObject["devices"][0]["value"];
  subWattage= myObject["devices"][1]["value"];
}

String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, serverName);
  int httpResponseCode = http.GET();
  String payload = "{}";
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  return payload;
}

void collectData() {
  Voltage = getVPP();
  VRMS = (Voltage / 2.0) * 0.707; // sq root
  AmpsRMS = (VRMS * 1000) / mVperAmp;
  Wattage = (220 * AmpsRMS) - 18;
  differenceData = Wattage -subWattage;
  //differenceData
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
  amp["_id"] = "629b4bd7d818008e3048db14";
  amp["value"] = AmpsRMS;

  JsonObject wattage = documents.createNestedObject();
  wattage["_id"] = "629b4c0fd818008e3048db16";
  wattage["value"] = Wattage;
  JsonObject difference = documents.createNestedObject();
  difference["_id"] = "629b4c5ed818008e3048db1c";
  difference["value"] = differenceData;


  serializeJson(doc, httpRequestData);
  int httpResponseCode = http.POST(httpRequestData);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  http.end();

}
