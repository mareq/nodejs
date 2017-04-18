#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_streams.htm


var fs = require("fs");
var data = '';

// Create a readable stream
var readerStream = fs.createReadStream('input.txt');

// Set the encoding to be utf8. 
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on(
  'data',
  function(chunk) {
    data += chunk;
  }
);

readerStream.on(
  'end',
  function() {
    console.log(data);
  }
);

readerStream.on(
  'error',
  function(err) {
     console.log(err.stack);
  }
);

// will this ever be invoked on readable stream?
readerStream.on(
  'finish',
  function() {
    console.log('finish');
  }
);


console.log("Program Ended");


