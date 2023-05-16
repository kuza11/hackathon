// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var mysqlx = require('@mysql/xdevapi');
const config = require('../../../config.json');
export default async function handler(req, res) {
  let mySession = await mysqlx.getSession( {
    host: config.host, port: config.port,
    user: config.username, password: config.password 
  });

  let sqlRes = (await mySession.sql("select * from hackathon.data").execute()).fetchAll();

  console.log(JSON.stringify(sqlRes));

  res.status(200).json({
    message: sqlRes
  });

  mySession.close();
}

