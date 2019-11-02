/*
let http = require('http');
let fs = require('fs');
let myreadstream = fs.createReadStream(__dirname + '/randomtext.txt', 'utf8');
let mywritestream = fs.createWriteStream(__dirname + '/writeMe.txt');
myreadstream.on('data', (chunk) => {
  console.log('new chunk received: ');
  mywritestream.write(chunk);
});
*/

//pipes - only from readable streams

let http = require('http');
let fs = require('fs');
let myreadstream = fs.createReadStream(__dirname + '/randomtext.txt', 'utf8');
let mywritestream = fs.createWriteStream(__dirname + '/writeMe.txt');

myreadstream.pipe(mywritestream);
