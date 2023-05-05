//#include <Arduino.h>      
#include <ESP8266WiFi.h>    //for WiFi  
#include <Wiegand.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h> 


#include <SoftwareSerial.h> //for gps

#define WIEGAND_DATA_0 D3 // Wiegand line pins
#define WIEGAND_DATA_1 D4\
#define MAX_CODES 100   // Maximum number of codes to store
// Define the pins used for the GPS module
const int gpsRxPin = 8;   // GPS module TX pin to Node MCU D8 pin
const int gpsTxPin = 7;   // GPS module RX pin to Node MCU D7 pin

// Create a SoftwareSerial object for the GPS module
SoftwareSerial gpSS(gpsRxPin, gpsTxPin);

static const uint32_t BaudRate = 9600;

//connecting to wifi
const char* ssid = "PLDTHOMEFIBR0dae0"; 
const char* password = "PLDTWIFI44ffx";

WIEGAND wg;

String serverName = "http://192.168.1.9:5001/api/v1/gps/product-item";


uint32_t codes[MAX_CODES];   // Array to store previous codes
int num_codes = 0;   // Number of codes currently stored

void setup() {
  Serial.begin(BaudRate);

  //setting up connection with the wifi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");

    if (WiFi.status() == 6){
      Serial.println("WRONG PASSWORD");
    }
    else if (WiFi.status() == WL_DISCONNECTED){
      Serial.println("DISCONNECTED");
    }
    else if (WiFi.status() == WL_CONNECT_FAILED){
      Serial.println("CONNECTION FAILED");
    }
    else if (WiFi.status() == WL_IDLE_STATUS){
      Serial.println("CHANGING STATUS");
    }
    else if (WiFi.status() == WL_NO_SSID_AVAIL){
      Serial.println("WIFI CANNOT BE REACHED");
    }
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());


  //once there is an internet connection.. set-up RFID reading
  // default Wiegand Pin 3 and Pin 4 see image on README.md
  // for non UNO board, use wg.begin(pinD0, pinD1) whokmijmijmere pinD0 and pinD1
  // are the pins connected to D0 and D1 of wiegand reader respectively.
  //wg.begin(WIEGAND_DATA_0, WIEGAND_DATA_1, true, false); 
  pinMode(WIEGAND_DATA_0, INPUT_PULLUP);
  pinMode(WIEGAND_DATA_1, INPUT_PULLUP);
  wg.begin(WIEGAND_DATA_0, WIEGAND_DATA_1);

  //after setting-up RFID reader, set-up GPS module
  gpSS.begin(BaudRate); //for gps
}

void loop() {
  if(wg.available()){
    uint32_t new_code = wg.getCode();   // Get the new Wiegand code
    
    // Check if the new code is unique
    bool is_unique = true;
    for(int i = 0; i < num_codes; i++){
      if(new_code == codes[i]){
        is_unique = false;
        break;
      }
    }
    // Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // If you need Node-RED/server authentication, insert user and password below
      //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

      http.addHeader("Content-Type", "application/json");
      // Send HTTP GET request
        // If the new code is unique, print it and store it in the codes array
    if(is_unique){
      codes[num_codes] = new_code;
      int httpResponseCode = http.POST("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String (codes[num_codes]) + "\"}");

      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
      num_codes++;
      Serial.print("New unique code: ");
      Serial.println(new_code, HEX);
      Serial.print("Total unique codes: ");
      Serial.println(num_codes);
    }
    else if(!is_unique){
      int httpResponseCode = http.POST("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String (new_code) + "\"}");
      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
      Serial.print("New generic code: ");
      Serial.println(new_code, HEX);
      Serial.print("Total unique codes: ");
      Serial.println(num_codes);
    }
   }else {
      Serial.println("WiFi Disconnected");
    }   
  }

  // For GPS 
  if (gpSS.available() > 0) {
    char c = gpSS.read(); // while acquiring signal, read the incoming byte

    static char buffer[80];
    static int i = 0;
    buffer[i++] = c;   // generating string
    bool end_of_string = c == '\n';
    if (end_of_string) {
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // If you need Node-RED/server authentication, insert user and password below
      //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String (buffer) + "\"}");

      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
      // send_post_request("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String(buffer) + "\"}", "/api/v1/gps/product-item");
    }
  }
}
