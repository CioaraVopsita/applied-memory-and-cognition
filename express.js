let http = require('http');
let express = require('express');
let fs = require('fs');
let shortid = require ('shortid');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let randomallocation = require ('./randomallocation');
let lineup = require ('./line-up');
let mysql = require('mysql');
let {Client} = require('pg');
let sanitizer = require('sanitize')();
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/*let conectionString = process.env.DATABASE_URL;
if (port == null || port == ""){
  conectionString = "postgres://postgres:polarbear06@localhost:5432/mel-exp";
};*/

//let conString = "postgres://postgres:polarbear06@localhost:5432/mel-exp";
let dbconnect = new Client({
  connectionString:process.env.DATABASE_URL,
  ssl: true,
  });

//console.log(process.env.DATABASE_URL);

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

app.use(cookieParser());


//handle static files!!!!!!!!!!!! first / is mapping the url and the second one is mapping the folder.
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/stimuli', express.static(__dirname + '/stimuli'));
//no need to specify content type in header

app.get('/start', (req, res) => {
  res.sendFile(__dirname + '/public/welcome.html');});

app.get('/loaderio-3382f0ceccdcfa4e0cf7a0fd8f744eb7', (req, res) => {
  res.sendFile(__dirname + '/loaderio-3382f0ceccdcfa4e0cf7a0fd8f744eb7.txt');});

app.post('/start/consent', (req, res) => {
  if (randomallocation.arr_of_cond.length < 1){
    res.sendFile(__dirname + '/public/end.html');
    //console.log ("Server will shut down");
    //server.close(); !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  } else {
    if(req.cookies.participant === undefined) {
      let biscuit = shortid.generate();
      console.log (biscuit);
      res.cookie ('participant', biscuit, {path: '/start'});
      console.log(req.cookies.participant);
      res.sendFile(__dirname + '/public/consent.html');

      //Insert cookie in the database
      dbconnect.query('INSERT INTO mel_exp(biscuit) VALUES($1)', [biscuit], (err) => {
        if (err) throw err;
        console.log('cookie set!');

      });
    }
      else {res.sendFile(__dirname + '/public/preventRetake.html');
    }
}});

app.post('/start/videoinstructions', randomallocation.generate_random_condition, (req,res)=> {
  //Update with prolificID
  let prolificID = sanitizer.value(req.body.prolificID, /^[\w\.\,\s]+$/);
  dbconnect.query('UPDATE mel_exp SET prolificID = ($1) WHERE biscuit = ($2)', [prolificID, req.cookies.participant], (err) => {
    if (err) throw err;});
});

app.post ('/start/video', (req, res) => {
  res.sendFile(__dirname + '/public/video.html');
  console.log(req.cookies.participant);
 });

 app.post('/start/videoProblems',
 function (req, res) {
   //Update database with which video was watched
   dbconnect.query('UPDATE mel_exp SET videotype = ($1) WHERE biscuit = ($2)', [req.body.videoType, req.cookies.participant], (err) => {
     if (err) throw err;});
   res.sendFile(__dirname + '/public/videoProblems.html');
   console.log(req.cookies.participant);});

app.post('/start/tetris', (req,res) => {
  //Update database with the video problems
  let videochecktextarea = sanitizer.value(req.body.videochecktextarea, /^[\w\.\,\s]*$/);
  dbconnect.query('UPDATE mel_exp SET videoproblems = ($1) WHERE biscuit = ($2)', [videochecktextarea, req.cookies.participant], (err) => {
    if (err) throw err;});
  res.sendFile(__dirname + '/public/tetris.html');
});

 app.post ('/start/line-up-instructions', (req,res) => {
   // Query the database for the condition in order to send the correct line-up instructions.
   dbconnect.query('SELECT cond FROM mel_exp WHERE biscuit = ($1)', [req.cookies.participant], (err, result) => {
     if (err) throw err;
     else {
       if (result.rows[0].cond === 1) { //!!!!!!!!! will not be an array!!!! => no need for result[]
          res.sendFile(__dirname + '/public/line-up-instructions.html');}
       else if (result.rows[0].cond === 2) {
          res.sendFile(__dirname + '/public/line-up-instructions2.html');}
       else if (result.rows[0].cond === 3) {
          res.sendFile(__dirname + '/public/line-up-instructions3.html');}  }
        })});

 app.post('/start/line-up', lineup.line_up_page);

 app.post('/start/confidence', (req,res) => {
   dbconnect.query('SELECT relineup FROM mel_exp WHERE biscuit = ($1)', [req.cookies.participant], (err, result) => {
     if (err) throw err;
     else {
       if (result.rows[0].relineup == 0) {
         //Update database
         dbconnect.query('UPDATE mel_exp SET facesarray=($1), faceclicked=($2), reactiontime=($3) WHERE biscuit = ($4)', [req.body.array, req.body.faceClicked, req.body.reactiontime, req.cookies.participant], (err) => {
           if (err) throw err;});
       }
       else if (result.rows[0].relineup === 1) {
         dbconnect.query('UPDATE mel_exp SET faceclicked2=($1), reactiontime_relineup=($2) WHERE biscuit = ($3)', [req.body.faceClicked2, req.body.reactiontime_relineup, req.cookies.participant], (err) => {
           if (err) throw err;});
       }}});
   // if cond 1, 3 confidence1; if cond 2, send confidence2.
   dbconnect.query('SELECT cond, buttonclicked FROM mel_exp WHERE biscuit = ($1)', [req.cookies.participant], (err, result) => {
     if (err) throw err;
     else {
       if ((result.rows[0].cond === 1) || (result.rows[0].cond === 3)) { //!!!!!!!!! will not be an array!!!! => no need for result[]
          if (result.rows[0].buttonclicked=="Not present"){
            res.sendFile(__dirname + '/public/confidenceNP.html');}
          else if (result.rows[0].buttonclicked==0){
            res.sendFile(__dirname + '/public/confidenceP.html');}
          else if (result.rows[0].buttonclicked=="Don't know") {
            res.sendFile(__dirname + '/public/confidenceDK.html');}}
       else if (result.rows[0].cond === 2) {
          res.sendFile(__dirname + '/public/confidenceDK.html');}}
        });
 });

app.post('/start/reline-up-instructions', (req,res) => {
  dbconnect.query('UPDATE mel_exp SET facesarray=($1), buttonclicked=($2), reactiontime=($3), relineup=1 WHERE biscuit = ($4)', [req.body.array, req.body.buttonClicked, req.body.reactiontime, req.cookies.participant], (err) => {
    if (err) throw err;});
  res.sendFile(__dirname + '/public/reline-up-instructions.html');
});

app.post('/start/reline-up', (req,res) => {
  dbconnect.query('SELECT videotype, facesarray FROM mel_exp WHERE biscuit = ($1)', [req.cookies.participant], (err, result) => {
    if (err) throw err;
    else {
      let videoType = result.rows[0].videotype;
      let reline = result.rows[0].facesarray;
      res.render(__dirname + "/public/reline-up.html", {reline:reline, videoType:videoType});}
})});

app.post('/start/videocheck', (req,res) => {
  dbconnect.query('UPDATE mel_exp SET confidence=($1) WHERE biscuit = ($2)', [req.body.confidence, req.cookies.participant], (err) => {
    if (err) throw err;});
  res.sendFile(__dirname + '/public/videocheck.html');
});

app.post('/start/demographics', (req,res) => {
  //let crime = sanitizer.value(req.body.crime, /^[\w\.\,\s]+$/);
  //let sceneDescription = sanitizer.value(req.body.sceneDescription, /^[\d]+$/);
  dbconnect.query('UPDATE mel_exp SET crime=($1), scenedescription=($2) WHERE biscuit = ($3)', [req.body.crime, req.body.sceneDescription, req.cookies.participant], (err) => {
    if (err) throw err;});
  res.sendFile(__dirname + '/public/demographics.html');
});

app.post('/start/thankyou', (req,res) => {
  dbconnect.query('UPDATE mel_exp SET age=($1), ethnicity=($2), gender=($3), education=($4) WHERE biscuit = ($5)', [req.body.age, req.body.ethnicity, req.body.gender, req.body.education, req.cookies.participant], (err) => {
    if (err) throw err;});
  res.sendFile(__dirname + '/public/thankyou.html');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
