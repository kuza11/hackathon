const mysql = require("mysql2/promise");
const config = require("../../../config.json");

export default async function handler(req, res) {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    port: config.port,
  });
  (await connection).connect((error) => {
    if (error) {
      console.error(
        "An error occurred while connecting to the DB: " + error.stack
      );
      return;
    }
  });


  let result = (await (await connection).query("SELECT * FROM devices"))[0];

  res.status(200).json({message: result});


  (await connection).end();
}