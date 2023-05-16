// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require('mysql2/promise');
const config = require('../../../config.json');
const fs = require('fs');

const apiKey = 'L8WVN84TSGUFYE75PSCYX5UJT';

process.env.DB_HOST = config.host;
process.env.DB_USER = config.username;
process.env.DB_PASSWORD = config.password;
process.env.DB_DATABASE = config.database;
process.env.DB_PORT = config.port;

export default async function handler(req, res) {

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  });
  (await connection).connect(error => {
    if (error) {
      console.error('An error occurred while connecting to the DB: ' + error.stack);
      return;
    }
  });

  let data;

  data = await (await connection).query('SELECT * FROM data');



  const latitude = 14.6500186//req.body.lat;
  const longitude = 49.9870547//req.body.lon;

  const startDate = '2013-05-16';
  const endDate = '2023-05-16';

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/${startDate}/${endDate}?key=${apiKey}&contentType=json`;
  const url2 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/London,UK/2020-10-01/2020-12-31?key=${apiKey}`;


  let weather = (await fetch(url2));
  
  console.log(JSON.stringify(weather.status, null, 2));

  fs.writeFileSync("../../../weather.txt", JSON.stringify(weather, null, 2));



  res.status(200).json({message: weather});

  (await connection).end();
}
