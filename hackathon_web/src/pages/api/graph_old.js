// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require("mysql2/promise");
const config = require("../../../config.json");
const fs = require("fs");

const apiKey = "L8WVN84TSGUFYE75PSCYX5UJT";

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
    port: process.env.DB_PORT,
  });
  (await connection).connect((error) => {
    if (error) {
      console.error(
        "An error occurred while connecting to the DB: " + error.stack
      );
      return;
    }
  });


  let data = await (await connection).query("SELECT * FROM data");
  let oldest = await (await connection).query("SELECT * FROM data WHERE time = (SELECT MIN(time) FROM data);");
  let newest = await (await connection).query("SELECT * FROM data WHERE time = (SELECT MAX(time) FROM data);");

  let oldDate = new Date(oldest[0][0].time * 1000);
  let oldDateStr = oldDate.getFullYear() + "-" + (parseInt(oldDate.getMonth())+1) + "-" + oldDate.getDate();
  let newDate = new Date(newest[0][0].time * 1000);
  let newDateStr = newDate.getFullYear() + "-" + (parseInt(newDate.getMonth())+1) + "-" + newDate.getDate();
  console.log(oldDateStr);

  const latitude = 14.6500186; //req.body.lat;
  const longitude = 49.9870547; //req.body.lon;

  const startDate = oldDateStr;
  const endDate = newDateStr;

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=cloudcover&timezone=Europe%2FBerlin`;
  
  let weather = await (await fetch(url)).json();

  //let passArr = weather.hourly

  


  //console.log(JSON.stringify(weather, null, 2));

  //fs.writeFileSync("../../../weather.txt", JSON.stringify(weather, null, 2), {encoding: "utf8", flag: "w+"});

  res.status(200).json({ message: weather });

  (await connection).end();
}
