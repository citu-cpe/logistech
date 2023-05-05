#include <ESP8266WiFi.h>    // for WiFi
#include <Wiegand.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <SoftwareSerial.h> // for gps

#define WIEGAND_DATA_0 D3 // Wiegand line pins
#define WIEGAND_DATA_1 D4
#define MAX_CODES 100   // Maximum number of codes to store

// Define the pins used for the GPS module
const int gps_rx_pin = 8;   // GPS module TX pin to Node MCU D8 pin
const int gps_tx_pin = 7;   // GPS module RX pin to Node MCU D7 pin

// Create a SoftwareSerial object for the GPS module
SoftwareSerial gp_SS(gps_rx_pin, gps_tx_pin);

static const uint32_t BAUD_RATE = 9600;

// connecting to wifi
const char* ssid = "PLDTHOMEFIBR0dae0";
const char* password = "PLDTWIFI44ffx";

WIEGAND wg;

const String SERVER_NAME = "http://192.168.1.9:5001/api/v1";
const String GPS_API_PATH = "/product-item/gps";

uint32_t codes[MAX_CODES];   // Array to store previous codes
int num_codes = 0;   // Number of codes currently stored

void setup() {
  Serial.begin(BAUD_RATE);

  // setting up connection with the wifi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");

    switch(WiFi.status()) {
      case 6:
        Serial.println("WRONG PASSWORD"); break;
      case WL_DISCONNECTED:
        Serial.println("DISCONNECTED"); break;
      case WL_CONNECT_FAILED:
        Serial.println("CONNECTION FAILED"); break;
      case WL_IDLE_STATUS:
        Serial.println("CHANGING STATUS"); break;
      case WL_NO_SSID_AVAIL:
        Serial.println("WIFI CANNOT BE REACHED"); break;
    }
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());


  // once there is an internet connection.. set-up RFID reading
  // default Wiegand Pin 3 and Pin 4 see image on README.md
  // for non UNO board, use wg.begin(pinD0, pinD1) whokmijmijmere pinD0 and pinD1
  // are the pins connected to D0 and D1 of wiegand reader respectively.
  // wg.begin(WIEGAND_DATA_0, WIEGAND_DATA_1, true, false);
  pinMode(WIEGAND_DATA_0, INPUT_PULLUP);
  pinMode(WIEGAND_DATA_1, INPUT_PULLUP);
  wg.begin(WIEGAND_DATA_0, WIEGAND_DATA_1);

  // after setting-up RFID reader, set-up GPS module
  gp_SS.begin(BAUD_RATE); // for gps
}

void loop() {
  if (wg.available()) {
    uint32_t new_code = wg.getCode();   // Get the new Wiegand code

    // Check if the new code is unique
    bool is_unique = is_code_unique(codes, new_code, num_codes);

    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
      // If the new code is unique, print it and store it in the codes array
      if (is_unique) {
        codes[num_codes++] = new_code;
        send_post_request("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String (codes[num_codes]) + "\"}", GPS_API_PATH);
      }

      Serial.print("New unique code: ");
      Serial.println(new_code, HEX);
      Serial.print("Total unique codes: ");
      Serial.println(num_codes);
    } else {
      Serial.println("WiFi Disconnected");
    }
  }

  // For GPS
  if (gp_SS.available() > 0) {
    char c = gp_SS.read(); // while acquiring signal, read the incoming byte

    static char buffer[80];
    static int i = 0;
    buffer[i++] = c;   // generating string
    bool end_of_string = c == '\n';
    if (end_of_string) {
      send_post_request("{\"longitude\": 48.2082, \"latitude\": 16.3738, \"productItemId\": \"" + String(buffer) + "\"}", GPS_API_PATH);
    }
  }
}

bool is_code_unique(u_int32_t unique_codes[], u_int32_t new_code, int num_codes) {
  for (int i = 0; i < num_codes; i++) {
    if (new_code == unique_codes[i]) {
        return false;
    }
  }

  return true;
}

void send_post_request(String request_payload, String api_path) {
  WiFiClient client;
  HTTPClient http;

  http.begin(client, SERVER_NAME + api_path);
  http.addHeader("Content-Type", "application/json");

  int http_response_status_code = http.POST(request_payload);

  Serial.print("HTTP response status code: ");
  Serial.println(http_response_status_code);

  if (http_response_status_code > 0) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
  }

  // Free resources
  http.end();
}
