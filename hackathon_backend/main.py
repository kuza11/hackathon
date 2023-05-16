import paho.mqtt.client as mqtt
import mysql.connector

# MQTT server settings
broker_address = "192.168.103.219"
broker_port = 1883
username = "pi"
password = "senzor12345"

# MySQL settings
mysql_host = "192.168.103.219"
mysql_database = "hackathon"
mysql_user = "root"
mysql_password = "ZlabsuckDick"

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
    sql = "INSERT INTO your_table (column_name) VALUES (%s)"  # adjust to fit your table structure
    val = (msg.payload.decode(),)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, "record inserted.")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set(username, password)

client.connect(broker_address, broker_port)

client.loop_forever()
