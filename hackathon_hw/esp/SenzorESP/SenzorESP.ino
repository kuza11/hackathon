#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <NTPClient.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ElegantOTA.h>
#include "time.h"

// bla bla wifi a mqtt server
char* SSID = "Redmi Note 10S";
char* PASSWORD = "kopl12345";

char* server = "192.168.103.219";
int port = 1883;
char* mqtt_name = "pi";
char* mqtt_password = "senzor12345";

//topicy pro sending dat atd
char* console_log_topic = "senzor/console/log";
char* firstpair_topic = "senzor/firstpair";
//data topic bude dynamicke (MAC adresa)


const char* ntpServer = "pool.ntp.org";
unsigned long epochTime;
const float alpha = 0.98;  // Weight for accelerometer data
const float beta = 0.02;

// init retardovin
WiFiClient espClient;
PubSubClient client(espClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

WebServer ota_server(80);

BH1750 bh1750_a;
BH1750 bh1750_b;
Adafruit_MPU6050 mpu;

const int MPU_addr = 0x68;
int16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;

int minVal = 265;
int maxVal = 402;

double y;

struct GyroData {
  double y;
  double temp;
};

// wifi connect funkce
void wifi_connect() {
  WiFi.begin(SSID, PASSWORD);


  for (int c = 0; c < 10; c++) {

    if (c > 9) {
      Serial.println("SELHANI WIFI!");
      delay(3000);
      ESP.restart();
      break;
    }

    else if (WiFi.status() != WL_CONNECTED) {
      break;
    }

    delay(500);
    Serial.println("Pripojovani...");
  }


  ota_server.on("/", []() {
    ota_server.send(200, "text/plain", "prejdi na /update");
  });

  ElegantOTA.begin(&ota_server);  // Start ElegantOTA
  ota_server.begin();

  delay(500);
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
}

void setup_sensors() {
  Wire.begin(18, 19);
  Wire1.begin(21, 22);

  if (!bh1750_a.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23, &Wire)) {
    Serial.println("Failed to find luxmetr A chip");
    while (1) {
      delay(10);
    }
  }

  if (!bh1750_b.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x5C, &Wire1)) {
    Serial.println("Failed to find luxmetr B chip");
    while (1) {
      delay(10);
    }
  }

  Wire1.beginTransmission(MPU_addr);
  Wire1.write(0x6B);
  Wire1.write(0);
  Wire1.endTransmission(true);
}

float get_lux_A() {

  float light_level_a;
  if (bh1750_a.measurementReady()) {
    light_level_a = bh1750_a.readLightLevel();
  }

  return light_level_a;
}

float get_lux_B() {

  float light_level_b;
  if (bh1750_b.measurementReady()) {
    light_level_b = bh1750_b.readLightLevel();
  }

  return light_level_b;
}

#ifdef __cplusplus
extern "C" {
#endif

  uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

uint8_t temprature_sens_read();

GyroData get_gyro_data() {
  Wire1.beginTransmission(MPU_addr);
  Wire1.write(0x3B);
  Wire1.endTransmission(false);
  Wire1.requestFrom(MPU_addr, 14, true);
  AcX = Wire1.read() << 8 | Wire1.read();
  AcY = Wire1.read() << 8 | Wire1.read();
  AcZ = Wire1.read() << 8 | Wire1.read();
  Tmp = Wire1.read() << 8 | Wire1.read();
  int xAng = map(AcX, minVal, maxVal, -90, 90);
  int zAng = map(AcZ, minVal, maxVal, -90, 90);

  y = RAD_TO_DEG * (atan2(-xAng, -zAng) + PI);
  double temperature = (double)Tmp / 340.0 + 36.53;

  GyroData data;
  data.y = y;
  data.temp = temperature;
  return data;
}


unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return (0);
  }
  time(&now);
  return now;
}

//setup shit
void setup() {
  Serial.begin(115200);
  wifi_connect();

  client.setServer(server, port);
  client.setCallback(callback);

  while (!client.connected()) {
    String client_id = "";
    client_id += String(WiFi.macAddress());
    Serial.println("Pripajam sa na server");
    if (client.connect(client_id.c_str(), mqtt_name, mqtt_password)) {
      Serial.println("Pripojen na server");
      client.publish(firstpair_topic, client_id.c_str());
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  String log = "Esp online" + String(WiFi.macAddress());
  client.publish(console_log_topic, "On line");

  setup_sensors();
  configTime(0, 0, ntpServer);
}

int period = 10000;
unsigned long time_now = 0;

int period_ota = 1000;
unsigned long time_now_ota = 0;

//sukam jezky chodim pesky <333
void loop() {
  client.loop();

  if (millis() >= time_now + period) {
    time_now += period;
    StaticJsonBuffer<300> JSONbuffer;
    JsonObject& JSONencoder = JSONbuffer.createObject();

    GyroData gyro = get_gyro_data();

    JSONencoder["MAC"] = WiFi.macAddress().c_str();
    JSONencoder["Senzor_A"] = get_lux_A();
    JSONencoder["Senzor_B"] = get_lux_B();
    JSONencoder["Angle"] = gyro.y;
    JSONencoder["Temp"] = gyro.temp;
    JSONencoder["ESP-temp"] = (temprature_sens_read() - 32) / 1.8;
    JSONencoder["Timestamp"] = getTime() + 7200;

    char JSONmessageBuffer[200];
    JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

    String data_send_topic = String(WiFi.macAddress()) + "/data";
    const char* data_send_topic_cstr = data_send_topic.c_str();
    client.publish(data_send_topic_cstr, JSONmessageBuffer);

    Serial.println(JSONmessageBuffer);
    //B8:D6:1A:43:88:A8
  }

  if (millis() >= time_now_ota + period_ota) {
    time_now_ota += period_ota;
    ota_server.handleClient();
  }
}
