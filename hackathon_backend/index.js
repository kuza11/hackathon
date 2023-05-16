const mysql = require('mysql2');
const mqtt = require('mqtt');

// Database Setup
export default async function handler(req, res) {

 

    const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "hackathon",
    port: 3306
    });
    
     
    
    connection.connect(error => {
      if (error) {
        console.error('An error occurred while connecting to the DB: ' + error.stack);
        return;
      }
    
     
    
      console.log('Connected as id ' + connection.threadId);
    });

// MQTT Setup
const options = {
    username: 'pi',
    password: 'senzor12345'
  };

const client  = mqtt.connect('mqtt://localhost:1883',options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('message', (err) => {
    if (err) throw err;
  });
});

client.on('message', (topic, message) => {
  // message is a Buffer
  console.log(`Received message on ${topic}: ${message.toString()}`);
  
  const msgObj = JSON.parse(message.toString());
  const mac = msgObj.mac;
  const angle = msgObj.angle;

  // Save the message to the database
  const query = "INSERT INTO devices (mac, angle) VALUES (?, ?)";
  db.query(query, [mac, angle], (err, result) => {
    if (err) throw err;
    console.log('Message saved to the database');
  });
});
//test message
client.on('connect', () => {
    const data = {
        mac: "00:1B:44:99:99:99",
        angle: 69.69
    };

    client.publish('message', JSON.stringify(data));
});
