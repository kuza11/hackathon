import paho.mqtt.client as mqtt

# MQTT server settings
broker_address = "192.168.103.219"
broker_port = 1883
username = "pi"
password = "senzor12345"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker!")
    else:
        print("Failed to connect, return code %d" % rc)

def on_message(client, userdata, msg):
    print("Received message: %s" % msg.payload.decode())

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set(username, password)

client.connect(broker_address, broker_port)

def publish_message(topic, message):
    client.publish(topic, message)

def subscribe_topic(topic):
    client.subscribe(topic)

subscribe_topic("B8:D6:1A:43:88:A8/data")

client.loop_forever()

def publish_message(topic, message):
    client.publish(topic, message)
    
publish_message("senzor/console/log", "{\"device\": \"your_device\", \"timestamp\": 123456789, \"sensor_top\": 420, \"sensor_bottom\": 69, \"angle\": 20.69}")
subscribe_topic("B8:D6:1A:43:88:A8/data")