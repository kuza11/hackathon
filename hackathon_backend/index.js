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


        // Publish a message
        const topic = 'senzor/console/log';
        const message = JSON.stringify({
            device: 'your_device',
            timestamp: 123456789,
            sensor_top: 420,
            sensor_bottom: 69,
            angle: 20.69
        });
        client.publish(topic, message, (err) => {
            if (err) {
                console.error('Failed to publish message:', err);
            } else {
                console.log('Message published');
            }
            // Disconnect the MQTT client
            client.end();
        });
});

client.on('message', (topic, message) => {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());
    
    if (topic === 'senzor/console/log') {
      try {
        const msgObj = JSON.parse(message.toString());
        const device = msgObj.device;
        const timestamp = msgObj.timestamp;
        const sensorTop = msgObj.sensor_top;
        const sensorBottom = msgObj.sensor_bottom;
        const angle = msgObj.angle;
  
        // Save the message to the database
        const query = "INSERT INTO data (time, mac, sens_top, sens_bottom, temperature) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [timestamp, device, sensorTop, sensorBottom, 10], (err, result) => {
            if (err) {
                console.log('Log could not be saved in the database');
            } else {
                //add new device
                console.log('Log saved to the database');
                try {
                    // Save the message to the database
                    const query = "INSERT INTO devices (mac, angle) VALUES (?, ?)";
                    db.query(query, [device, angle], (err, result) => {
                        if (err) {
                           console.log('Device could not be saved in the database');
                        } else {
                            console.log('Device saved to the database');
                        }
                        });
                    } catch (error) {
                    console.log('Error parsing JSON message:', error.message);
                }
            }
        });
      } catch (error) {
        console.log('Error parsing JSON message:', error.message);
      }
    }
});
  

// client.on('senzor/console/log', (topic, message) => {
//     console.log('Received message on senzor/console/log');
//     console.log('Message:', message.toString());

//     const msgObj = JSON.parse(message.toString());
//     const device = msgObj.device;
//     const timestamp = msgObj.timestamp;
//     const sensorTop = msgObj.sensor_top;
//     const sensorBottom = msgObj.sensor_bottom;
//     const angle = msgObj.angle;

//     // Save the message to the database
//     const query = "INSERT INTO data (time, mac, sens_top, sens_bottom) VALUES (?, ?, ?, ?)";
//     db.query(query, [timestamp, device, sensorTop, sensorBottom], (err, result) => {
//         if (err) {
//             console.log('Message could not be saved in the database');
//         } else {
//             console.log('Message saved to the database');
//         }
//     });
// });
