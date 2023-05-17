// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require("mysql2/promise");
const config = require("../../../config.json");
const fs = require("fs");


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

  async function qry(qry, args){
    await (await connection).query(qry, args);
  }

  if(req.body.panel_count && req.body.power_per_panel)
    await (await connection).query("INSERT INTO users (panelsCnt, powerPerPanel) VALUES (?,?)", [req.body.panel_count, req.body.power_per_panel]);


  const coeff = 0.08;

  let data = await (await connection).query("SELECT * FROM data");
  let user = (await (await connection).query("SELECT * FROM users"))[0][0];

  let maxPow = user.panelsCnt * user.powerPerPanel;

  console.log(data[0][0]);

  let lastDayRecs = await qry("SELECT * FROM data WHERE time > ?;",[Math.floor(Date.now()/1000)-(24*3600)])[0];
  let lossday = 0;
  lastDayRecs.forEach((e) => {
    lossday += (e.power / (parseFloat(e.sens_top) + parseFloat(e.sens_bottom)) / 2) * coeff - maxPow;
  });

  let lastCleanedRecs = await qry("SELECT * FROM data WHERE time > (SELECT cleaning FROM users);")[0];
  let lossCleaned = 0;
  lastCleanedRecs.forEach((e) => {
    lossCleaned += (e.power / (parseFloat(e.sens_top) + parseFloat(e.sens_bottom)) / 2) * coeff - maxPow;
  });

  let loss = 0;
  data[0].forEach((e) => {
    loss += (e.power / (parseFloat(e.sens_top) + parseFloat(e.sens_bottom)) / 2) * coeff - maxPow;
  });

  res.status(200).json({
    message: {
      eff_graph:{ 
        graph: data[0].map((e) => {
          return {
            eff: (parseFloat(e.power) / ((parseFloat(e.sens_top) + parseFloat(e.sens_bottom)) / 2)) * 100,
            time: e.time
          };
        }),
        threshold: 50
      },
      stats: {
        moneyloss_day: lossday,
        moneyloss_last: lossCleaned,
        moneyloss_all: loss
      },

    },
  });


  //console.log(JSON.stringify(weather, null, 2));

  //fs.writeFileSync("../../../weather.txt", JSON.stringify(weather, null, 2), {encoding: "utf8", flag: "w+"});

  (await connection).end();



}


