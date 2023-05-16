const mysql = require('mysql2');
const mqtt = require('mqtt');

// Database Setup
const db = mysql.createConnection({
    host: '192.168.103.219',
    user: 'root',
    port: 3306,
    password: 'ZlabSuckDick',
    database: 'hackathon'
});


db.connect(error => {
    if (error) {
    console.error('An error occurred while connecting to the DB: ' + error.stack);
    return;
    }
    console.log('Connected as id ' + db.threadId);
    });
// MQTT Setup
const options = {
    username: 'pi',
    password: 'senzor12345'
  };

const client  = mqtt.connect('mqtt://192.168.103.219:1884',options);
console.log("still going");
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('message', (err) => {
    if (err) throw err;
  });
});

client.on('device', (topic, message) => {
  // message is a Buffer
  console.log(`Received message on ${topic}: ${message.toString()}`);
  
  const msgObj = JSON.parse(message.toString());
  const mac = msgObj.mac;
  const angle = msgObj.angle;

  // Save the message to the database
  const query = "INSERT INTO devices (mac, angle) VALUES (?, ?)";
  db.query(query, [mac, angle], (err, result) => {
    if (err) console.log('Message could not be saved in the database');
    console.log('Message saved to the database');
  });
});

client.on('senzor/console/log', (topic, message) => {
    // message is a Buffer
    console.log("someone called me");

    // console.log(`Received message on ${topic}: ${message.toString()}`);
    
    // const msgObj = JSON.parse(message.toString());
    // const device = msgObj.device;
    // const timestamp = msgObj.timestamp;
    // const sensorTop = msgObj.sensor_top;
    // const sensorBottom = msgObj.sensor_bottom;
    // const angle = msgObj.angle;
  
    // // Save the message to the database
    // const query = "INSERT INTO devices (device, timestamp, sensor_top, sensor_bottom, angle) VALUES (?, ?, ?, ?, ?)";
    // db.query(query, [device, timestamp, sensorTop, sensorBottom, angle], (err, result) => {
    //   if (err) console.log('Message could not be saved in the database');
    //   console.log('Message saved to the database');
    // });
  });