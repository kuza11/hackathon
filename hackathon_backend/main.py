import paho.mqtt.client as mqtt
import mysql.connector

# MQTT server settings
broker_address = "192.168.103.219"
broker_port = 1883
username = "pi"
password = "senzor12345"

# MySQL settings
mysql_host = "172.0.0.1"
mysql_database = "hackathon"
mysql_user = "root"
mysql_password = "ZlabSuckDick"

# Connect to MySQL
mydb = mysql.connector.connect(
  host=mysql_host,
  user=mysql_user,
  password=mysql_password,
  database=mysql_database
)

mycursor = mydb.cursor()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker!")
        client.subscribe("senzor/console/log")
    else:
        print("Failed to connect, return code %d" % rc)

def on_message(client, userdata, msg):
    print("Received message: %s" % msg.payload.decode())
    msg_obj = json.loads(msg.payload.decode())
    device = msg_obj.get('device')
    timestamp = msg_obj.get('timestamp')
    sensor_top = msg_obj.get('sensor_top')
    sensor_bottom = msg_obj.get('sensor_bottom')
    angle = msg_obj.get('angle')  # This doesn't seem to be used in your JS code
    temperature = msg_obj.get('temperature')

    sql = "INSERT INTO data (time, mac, sens_top, sens_bottom, temperature) VALUES (%s, %s, %s, %s, %s)"
    val = (timestamp, device, sensor_top, sensor_bottom, temperature)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, "record inserted.")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set(username, password)

client.connect(broker_address, broker_port)


