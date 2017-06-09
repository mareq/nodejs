const serialize = require('serialize-json');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " filename.json");
  process.exit(-1);
}

const filename = process.argv[2];
console.log(`Transforming ${filename}`);

const is = fs.createReadStream(filename);
const os = fs.createWriteStream(filename.split('.')[0] + '.txt');

is
  .pipe(JSONStream.parse('hits.hits.*'))
  .pipe(es.mapSync(d => stringify(d)))
  .pipe(es.mapSync(d => {
    os.write(d + '\n');
  }));


function stringify(obj) {
  let res = '';
  if (typeof obj === 'object') {
    for (let key in obj) {
      res += ' ' + stringify(obj[key]);
    }
  } else {
    obj = obj + ''; // HACK! Casting numbers to strings
    return obj.replace(/\n|<|>|\*|\_/g, ' ');
  }
  return res;
}