const mysql = require("mysql2/promise");
const config = require("../../../config.json");

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


  await (await connection).query("UPDATE users SET cleaning=?", [req.body.unix]);



}