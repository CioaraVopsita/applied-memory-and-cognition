let fs = require ('fs');
let mysql = require('mysql');
let {Client} = require('pg');

let dbconnect = new Client({
  connectionString:process.env.DATABASE_URL,
  ssl: true,
  });

//let conString = "postgres://postgres:polarbear06@localhost:5432/mel-exp";
//let dbconnect = new pg.Client(conString);

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

//Defining a condition class that represents the starting point for our 6 conditions.
class condition{
  constructor(number, count){
    this.number=number;
    this.count=count;
  }
}

//Constructing the 6 different conditions as objects, each with 2 attributes.
//The "number" attribute represents the condition itself and the "count" attribute
//keeps track of how many participants have been assigned to that partiuclat condtion.
let condition1 = new condition(1, 0);
let condition2 = new condition(2, 0);
let condition3 = new condition(3, 0);


//Creating an array with the 6 conditions and their attributes (objects).
let arr_of_cond = [condition1, condition2, condition3];

//The function creates a random integer between 1 and 6 and increases the count of the resulting condition, then
//calls functions "test" and "redirect".
  let generate_random_condition = function (req, res, next) {
    let index = Math.floor(Math.random()*arr_of_cond.length);
    let cond = arr_of_cond[index].number;
    arr_of_cond[index].count++;
  //  redirect(req, res, cond);
    if(arr_of_cond[index].count === 650) {
    arr_of_cond.splice(index, 1);};
    console.log(index);
    console.log(cond);
    console.log(arr_of_cond);

    //Put the condition in the database
    dbconnect.query('UPDATE mel_exp SET cond = ($1) WHERE biscuit = ($2)', [cond, req.cookies.participant], (err) => {
      if (err) throw err;});

      console.log(req.cookies.participant);
    res.sendFile(__dirname + "/public/videoinstructions.html", (err) => {
    if (err) {
    console.log("ERROR");
    throw "Please contact Dr. Melissa Colloff to inform her about this error!";}});
    next();
  }

/*function redirect (req, res, cond0) {
  res.sendFile(__dirname + `/conditions/condition${cond0}/pages/instructions.html`, (err) => {
    if (err) {
    console.log("ERROR");
    throw "Please contact Dr. Melissa Colloff to inform her about this error!";}});
  console.log(req.cookies.condition);
    //let fileName = req.cookies.participant;
    fs.writeFile(__dirname + `/conditions/condition${cond0}/data/${req.cookies.participant}.txt`, "start \n hello", (err) => {
      if (err) throw err;
      console.log('Updated!');});}*/

    module.exports = {
      generate_random_condition : generate_random_condition,
      arr_of_cond : arr_of_cond

    }
