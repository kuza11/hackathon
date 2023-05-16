var mariadb = require('mariadb');
const mqtt = require('mqtt');

// Database Setup
const db = mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'ZlabSuckDick',
    database: 'hackathon'
});

try {
    db.connect()
      .then(() => {
        console.log('Connected to the database');
      })
      .catch(err => {
        throw err;
      });
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }

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