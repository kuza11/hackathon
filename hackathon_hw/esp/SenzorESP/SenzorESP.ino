#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <NTPClient.h>
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

// init retardovin
WiFiClient espClient;
PubSubClient client(espClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

BH1750 bh1750_a;
BH1750 bh1750_b;
Adafruit_MPU6050 mpu;

// wifi connect funkce
void wifi_connect(){
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
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

  if (!bh1750_a.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23, &Wire1)) {
    Serial.println("Failed to find luxmetr A chip");
    while (1) {
      delay(10);
    }
  }

  if (!bh1750_b.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x5C, &Wire)) {
    Serial.println("Failed to find luxmetr B chip");
    while (1) {
      delay(10);
    }
  }

  if (!mpu.begin(0x68, &Wire1)) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_260_HZ);
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

float get_gyro(char axis) {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  switch (axis) {
    case 'x':
      return g.gyro.x;

    case 'y':
      return g.gyro.y;

    case 'z':
      return g.gyro.z;
  }
  // Return a default value if the axis parameter is invalid
  return 0.0f;
}

unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
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

void loop() {
  client.loop();

  if(millis() >= time_now + period){
        time_now += period;
        StaticJsonBuffer<300> JSONbuffer;
        JsonObject& JSONencoder = JSONbuffer.createObject();

        JSONencoder["MAC"] = WiFi.macAddress().c_str();
        JSONencoder["Senzor_A"] = get_lux_A();
        JSONencoder["Senzor_B"] = get_lux_B();
        JSONencoder["Angle"] = get_gyro('y');
        JSONencoder["Timestamp"] = getTime() + 7200; 
      
        char JSONmessageBuffer[200];
        JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

        String data_send_topic = WiFi.macAddress().c_str() + "/data"
        clinet.publish(data_send_topic, JSONmessageBuffer);

        Serial.println(JSONmessageBuffer);
  }
}
