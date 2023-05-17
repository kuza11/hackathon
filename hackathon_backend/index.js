'use strict'

const mqtt = require('mqtt')

// or const client = mqtt.connect({ port: 1883, host: '192.168.1.100', keepalive: 10000});
const options = {
    username: 'pi',
    password: 'senzor12345'
};
const client = mqtt.connect('mqtt://192.168.103.219', options);
client.subscribe('B8:D6:1A:47:D7:A8/data')
client.publish('mylf', 'SIeg hail')

client.on('message', function (topic, message) {
  console.log(message)
})