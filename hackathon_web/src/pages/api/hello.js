// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require('mysql2');
process.env.DB_HOST = "127.0.0.1";
process.env.DB_USER = "root";
process.env.DB_PASSWORD = "ZlabSuckDick";

export default async function handler(req, res) {

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "hackathon",
  port: 3306
});

connection.connect(error => {
  if (error) {
    console.error('An error occurred while connecting to the DB: ' + error.stack);
    return;
  }

  console.log('Connected as id ' + connection.threadId);
});

// Query the database
connection.query('SELECT * FROM data', function (error, results, fields) {
  if (error) throw error;
  // Log the results
  res.status(200).json({message: results});
});

// Close the connection when done
connection.end();
}
