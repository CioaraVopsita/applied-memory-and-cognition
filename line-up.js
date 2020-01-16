
let fs = require ('fs');
let {Client} = require('pg');
let mysql = require('mysql');

//CONNECT TO HEROKU
/*let dbconnect = new Client({
  connectionString:process.env.DATABASE_URL,
  ssl: true,
  });*/

//CONNECT TO LOCALHOST 
let conString = "postgres://postgres:PolarBear@06@localhost:5432/mel-exp";
let dbconnect = new Client(conString);

//CONNECT TO SQL
/*let dbconnect = mysql.createConnection({
  host: 'localhost',
  user: 'mel-exp-part',
  password: 'NNBSP3X2jsWBqL0i',
  database: 'mel-exp'
});*/

dbconnect.connect(function(err){
  if (err) throw err;
  console.log('Connected-psql');
});

let line_up_page = function (req, res) {

  //Perpetrator present or absent
 let target = Math.floor(Math.random()*2);

  //Update the database with the target
  dbconnect.query('UPDATE mel_exp SET target=($1) WHERE biscuit = ($2)', [target, req.cookies.participant], (err) => {
    if (err) throw err;});

  //Query the database for condition and videoType
  dbconnect.query('SELECT cond, videotype FROM mel_exp WHERE biscuit = ($1)', [req.cookies.participant], (err, result) => {
    if (err) throw err;
    else {
      let cond = result.rows[0].cond;
      let videoType = result.rows[0].videotype;

      res.sendFile(__dirname + `/public/lineup/${cond}${videoType}${target}.html`, (err) => {
        if (err) {
        console.log("ERROR");
        throw "Please contact Dr. Melissa Colloff to inform her about this error!";}});

  }})}


module.exports = {
  line_up_page : line_up_page
}
