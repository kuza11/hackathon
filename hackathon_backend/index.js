const mysql = require('mysql');
const mqtt = require('mqtt');

// Database Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// MQTT Setup
const client  = mqtt.connect('mqtt://mqtt_broker_url');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('your_topic', (err) => {
    if (err) throw err;
  });
});

client.on('message', (topic, message) => {
  // message is a Buffer
  console.log(`Received message on ${topic}: ${message.toString()}`);
  
  // Save the message to the database
  const query = 'INSERT INTO your_table (message) VALUES (?)';
  db.query(query, [message.toString()], (err, result) => {
    if (err) throw err;
    console.log('Message saved to the database');
  });
});
