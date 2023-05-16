const mysql = require('mysql2');
const mqtt = require('mqtt');

// Database Setup
const db = mysql.createConnection({
    host: '127.0.0.1',
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

const client = mqtt.connect('mqtt://192.168.103.219', options);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('senzor/console/log', (err) => {
        if (err) throw err;
        console.log('Subscribed to senzor/console/log');
    });
    client.subscribe('message', (err) => {
        if (err) throw err;
        console.log('Subscribed to message');
    });
});

client.on('message', (topic, message) => {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());
});

client.on('senzor/console/log', (topic, message) => {
    console.log('Received message on senzor/console/log');
    console.log('Message:', message.toString());

    const msgObj = JSON.parse(message.toString());
    const device = msgObj.device;
    const timestamp = msgObj.timestamp;
    const sensorTop = msgObj.sensor_top;
    const sensorBottom = msgObj.sensor_bottom;
    const angle = msgObj.angle;

    // Save the message to the database
    const query = "INSERT INTO devices (device, timestamp, sensor_top, sensor_bottom, angle) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [device, timestamp, sensorTop, sensorBottom, angle], (err, result) => {
        if (err) {
            console.log('Message could not be saved in the database');
        } else {
            console.log('Message saved to the database');
        }
    });
});

const data = {
    device: 'mekac adresa',
    timestamp: 12321221212123,
    sensor_top: 420,
    sensor_bottom: 69,
    angle: 20.69,
};

client.publish('senzor/console/log', JSON.stringify(data));