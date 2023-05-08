//#include <Arduino.h>      
#include <ESP8266WiFi.h>    //for WiFi  
#include <Wiegand.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h> 
#include <SoftwareSerial.h>

#define WIEGAND_DATA_0 D3 // Wiegand line pins
#define WIEGAND_DATA_1 D4
#define MAX_CODES 100   // Maximum number of codes to store

SoftwareSerial ss(D7, D6);  // Rx, TX
float longdecimalDegrees;
float latdecimalDegrees;

static const uint32_t BaudRate = 9600;

//connecting to wifi
const char* ssid = "PLDTHOMEFIBR0dae0"; 
const char* password = "PLDTWIFI44ffx";

WIEGAND wg;

String serverName = "http://192.168.1.2:5001/api/v1/gps/product-item";

uint32_t codes[MAX_CODES];   // Array to store previous codes
int num_codes = 0;   // Number of codes currently stored

void setup() {
  Serial.begin(BaudRate);
  ss.begin(BaudRate);

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

}

void loop() {
    while((ss.available() > 0)){
    char c = ss.read();

    static char buffer[80];
    static int i = 0;
     if (c == '\n') {
      buffer[i] = '\0'; // terminate the string
      i = 0; // reset the buffer index
          if (strncmp(buffer, "$GPGLL", 6) == 0) { // check if the sentence is GPGLL
            char *token = strtok(buffer, ","); 
            token = strtok(NULL, ","); 
            float latitude = atof(token); 
            token = strtok(NULL, ","); 
            token = strtok(NULL, ","); 
            float longitude = atof(token);
            token = strtok(NULL, ","); 
            token = strtok(NULL, ",");
            token = strtok(NULL, ","); 
            if (strcmp(token, "A") == 0) { 
              // convert latitude to degrees format
              int degrees = (int)latitude / 100;
              float minutes = latitude - (degrees * 100);
              latdecimalDegrees = degrees + (minutes / 60);
              
              // convert longitude to degrees format
              degrees = (int)longitude / 100;
              minutes = longitude - (degrees * 100);
             longdecimalDegrees = degrees + (minutes / 60);
              break;
            }
        }
    } else {
      buffer[i++] = c; // add the character to the buffer
    }
     
  }
 
    if(wg.available()){
    uint32_t new_code = wg.getCode();   // Get the new Wiegand code
    char c = ss.read(); //reads gps data

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

      http.addHeader("Content-Type", "application/json");
      
      
    if(is_unique){
      codes[num_codes] = new_code;
    //  float* latLong = getLatAndLong();
      

      int httpResponseCode = http.POST("{\"longitude\": " + String(longdecimalDegrees, 6) + ", \"latitude\": " + String(latdecimalDegrees, 6) + ", \"rfid\": \"" + String(codes[num_codes]) + "\"}");


      
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
      Serial.print("Latitude (DMS): ");
      Serial.println(latdecimalDegrees, 6);
      Serial.print("Longitude (DMS): ");
      Serial.println(longdecimalDegrees, 6);
    }
    else if(!is_unique){
      int httpResponseCode = http.POST("{\"longitude\": " + String(longdecimalDegrees, 6) + ", \"latitude\": " + String(latdecimalDegrees, 6) + ", \"rfid\": \"" + String(new_code) + "\"}");
      
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
      Serial.print("Latitude (DMS): ");
      Serial.println(latdecimalDegrees, 6);
      Serial.print("Longitude (DMS): ");
      Serial.println(longdecimalDegrees, 6);
    }
   }else {
      Serial.println("WiFi Disconnected");
    }   
  }
}
