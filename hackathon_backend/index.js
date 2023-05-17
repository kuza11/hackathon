'use strict'

const mysql = require('mysql2');
const mqtt = require('mqtt');

const queueDelay = 5000; //Rate wich data is being send onto database
var queueDelayCurrent = queueDelay;
var queueDelayRunning = false;
var logQueue = [];
var logQueueAmmount = [];

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

client.subscribe('B8:D6:1A:47:D7:A7/data')

client.on('message', (topic, message) => {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());
    //ON LOG RECEIVE
    if (topic === 'B8:D6:1A:47:D7:A7/data') {
        
        const msgObj = JSON.parse(message.toString());

        //Queue
        var index = 0;
        const macExists = logQueue.some((log) => {
            // Assume each log is an object with a 'MAC' property
            index++;
            if(log.MAC === msgObj.MAC){
                index = 0;
                return true;
            }

        });
        if(!macExists)
        {
            logQueueAmmount.push(1);
            logQueue.push(msgObj);
            console.log("Added log to queue");
            if(!queueDelayRunning){
                queueDelayRunning = true;
                setTimeout(() => {
                    console.log("Timer finished");
                    addLogs();
                    queueDelayRunning = false;
                }, queueDelayCurrent);
            }
        }
        else{
            logQueueAmmount[index]++;
            logQueue[index].timestamp += msgObj.Timestamp;
            logQueue[index].temperature += msgObj.ESP_temp;
            logQueue[index].Senzor_A += msgObj.Senzor_A;
            logQueue[index].Senzor_B += msgObj.Senzor_B;
        }
    }
});
function addLogs()
{
    var index = 0;
    logQueue.forEach((msgObj) => {
        try {
            const ammount =  logQueueAmmount[index];
            const device = msgObj.MAC;
            const timestamp = msgObj.Timestamp / ammount;
            const sensorTop = msgObj.Senzor_A / ammount;
            const sensorBottom = msgObj.Senzor_B / ammount;
            const angle = msgObj.Angle;
            const temperature = msgObj.ESP_temp / ammount;
            console.log(timestamp+" "+sensorTop+" "+sensorBottom+" "+temperature);

            // Save the log to the database
            const query = "INSERT INTO data (time, mac, sens_top, sens_bottom, temperature) VALUES (?, ?, ?, ?, ?)";
            db.query(query, [timestamp, device, sensorTop, sensorBottom, temperature], (err, result) => {
                if (err) {
                    console.log('Log could not be saved in the database');
                } else {
                    //add new device
                    console.log('Log saved to the database');
                    try {
                        // Save the device to the database
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
    })
    index++;
}
client.on('error', (error) => {
    console.error('An error occurred:', error.message);
});

client.publish('B8:D6:1A:47:D7:A7/data', JSON.stringify({
    MAC: 'hovno',
    Timestamp: 100,
    Senzor_A: 100,
    Senzor_B: 100,
    Angle: 10.00,
    ESP_temp: 10.00,
}));
client.publish('B8:D6:1A:47:D7:A7/data', JSON.stringify({
    MAC: 'ligma',
    Timestamp: 500,
    Senzor_A: 500,
    Senzor_B: 500,
    Angle: 50.00,
    ESP_temp: 50.00,
}));
client.publish('B8:D6:1A:47:D7:A7/data', JSON.stringify({
    MAC: 'hovno',
    Timestamp: 200,
    Senzor_A: 200,
    Senzor_B: 200,
    Angle: 20.00,
    ESP_temp: 20.00,
}));
client.publish('B8:D6:1A:47:D7:A7/data', JSON.stringify({
    MAC: 'ligma',
    Timestamp: 400,
    Senzor_A: 400,
    Senzor_B: 400,
    Angle: 40.00,
    ESP_temp: 40.00,
}));
client.publish('B8:D6:1A:47:D7:A7/data', JSON.stringify({
    MAC: 'hovno',
    Timestamp: 200,
    Senzor_A: 200,
    Senzor_B: 200,
    Angle: 20.00,
    ESP_temp: 20.00,
}));