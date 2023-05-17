const mysql = require('mysql2');
const mqtt = require('mqtt');

const queueDelay = 3600000 ; //Rate wich data is being send onto database
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

client.subscribe('B8:D6:1A:47:D7:A8/data')
client.subscribe('B8:D6:1A:43:88:A8/data')

client.on('message', (topic, message) => {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());
    //ON LOG RECEIVE
    if (topic === 'B8:D6:1A:47:D7:A8/data' || topic === 'B8:D6:1A:43:88:A8/data') {
        
        const msgObj = JSON.parse(message.toString());

        //Queue
        var index = -1;
        const macExists = logQueue.some((log) => {
            // Assume each log is an object with a 'MAC' property
            index++;
            if(log.MAC === msgObj.MAC){
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
            //add new device
            console.log('Log saved to the database');
            try {
                // Save the device to the database
                const query = "INSERT INTO devices (mac, angle, sens_top, sens_bottom, temperature, time) VALUES (?, ?, ?, ?, ?, ?)";
                db.query(query, [msgObj.MAC, msgObj.Angle, msgObj.Senzor_A, msgObj.Senzor_B, msgObj.Temp, msgObj.Timestamp ], (err, result) => {
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
        else{
            //add values
            logQueueAmmount[index]++;
            console.log(logQueue[index].MAC +" na index "+index+" je ted "+ logQueueAmmount[index]);
            logQueue[index].Timestamp += msgObj.Timestamp;
            logQueue[index].ESP_temp += msgObj.Temp;
            logQueue[index].Senzor_A += msgObj.Senzor_A;
            logQueue[index].Senzor_B += msgObj.Senzor_B;

            //update live
            const updateDevice = async () => {
                console.log("update called");
                try {
                  const query = `
                    UPDATE devices
                    SET angle = ?, sens_top = ?, sens_bottom = ?, temperature = ?, time = ?
                    WHERE mac = ?
                  `;
              
                  const [result] = await db.promise().execute(query, [msgObj.Angle, msgObj.Senzor_A, msgObj.Senzor_B, msgObj.Temp, msgObj.Timestamp, msgObj.MAC]);
              
                  if (result.affectedRows > 0) {
                    console.log('Device updated successfully.');
                  } else {
                    console.log('Device not found or no changes made.' + msgObj.MAC);
                  }
                } catch (error) {
                  console.error('Failed to update device:', error);
                }
            };
            console.log("calling update");
            updateDevice();
        }
        index = 0;
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
            const temperature = msgObj.Temp / ammount;
            

            // Save the log to the database
            const query = "INSERT INTO data (time, mac, sens_top, sens_bottom, temperature) VALUES (?, ?, ?, ?, ?)";
            db.query(query, [timestamp, device, sensorTop, sensorBottom, temperature], (err, result) => {
                if (err) {
                    console.log('Log could not be saved in the database');
                }
            });
        } catch (error) {
        console.log('Error parsing JSON message:', error.message);
    }
    index++;
    })
    
}
logQueue = [];
logQueueAmmount = [];
client.on('error', (error) => {
    console.error('An error occurred:', error.message);
});