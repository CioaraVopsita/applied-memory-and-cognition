let http = require('http');
let fs = require('fs');


let server = http.createServer((req, res) => {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  let myreadstream = fs.createReadStream(__dirname + '/index.html', 'utf8');
  myreadstream.pipe(res);

  //predetermined text and not a file
  //res.write('Hello there brown cow!');
  //res.end();
});

server.listen(3000, '127.0.0.1');
console.log("Server running");
