const mysql = require('mysql');
const mqtt = require('mqtt');

// Database Setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'ZlabSuckDick',
    database: 'hackathon'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// MQTT Setup
const client  = mqtt.connect('mqtt://localhost:1883');

//let mySession = await mysqlx.getSession( {
//     host: config.host, port: config.port,
//     user: config.username, password: config.password
//     });
//     let sqlRes = (await mySession.sql("select * from hackathon.data").execute()).fetchAll();

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('message', (err) => {
    if (err) throw err;
  });
});

client.on('message', (topic, message) => {
  // message is a Buffer
  console.log(`Received message on ${topic}: ${message.toString()}`);
  
  // Save the message to the database
  const query = "INSERT INTO angle (mac, angle) VALUES ('00:1B:44:11:3A:B7', 128.55)";
  db.query(query, [message.toString()], (err, result) => {
    if (err) throw err;
    console.log('Message saved to the database');
  });
});
//test message
client.on('connect', () => {
    client.publish('message', 'Test message');
  });