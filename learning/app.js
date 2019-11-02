let fs = require('fs');

/*//sync
let readMe = fs.readFileSync('readMe.txt', 'utf8');
//console.log(readMe);

fs.writeFileSync('writeMe.txt', readMe);*/

//async - need a callback function to fire when the process is complete; non-blocking code
/*fs.readFile('readMe.txt', 'utf8', (err, data) => {
  fs.writeFile('writeMe.txt', data, (err) => {
    if (err) throw 'CRAP!';
    console.log("It is saved!");
  });
});*/

/*let index = Math.floor(Math.random()*6 + 1);
console.log(index);
fs.writeFile(`../conditions/condition${index}/data/writeMe${index}.txt`, "hehee", (err) => {
  if (err) throw 'CRAP!';
  console.log("It is saved!");
});*/
