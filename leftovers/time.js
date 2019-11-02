let http = require('http');
let express = require('express');
let fs = require('fs');
let epp = express();


epp.get ('/test',
function (req, res, next) {
  res.sendFile(__dirname + '/basics.html');
  next();},
function (req, res) {
  setTimeout( function (res) {
  res.redirect('/testtest');}, 10000, res);});


epp.get ('/testtest', function(req, res) {
  res.sendFile(__dirname + '/public/welcome.html');
});



/*setTimeout(function () {
  console.log('boo')
}, 5000);*/


epp.listen(4000);
