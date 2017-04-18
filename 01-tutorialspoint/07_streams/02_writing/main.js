#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_streams.htm


var fs = require("fs");
var data = 'Simply Easy Learning\n';

// Create a writable stream
var writerStream = fs.createWriteStream('output.txt');

// Write the data to stream with encoding to be utf8
writerStream.write(data, 'UTF8');

// Mark the end of file
writerStream.end();

// Handle stream events --> finish, and error
writerStream.on(
  'finish',
  function() {
    console.log("Write completed.");
  }
);

writerStream.on(
  'error',
  function(err) {
     console.log(err.stack);
  }
);

// will this ever be invoked on writable stream?
writerStream.on(
  'data',
  function() {
    console.log('data');
  }
);

// will this ever be invoked on writable stream?
writerStream.on(
  'end',
  function() {
    console.log('end');
  }
);

console.log("Program Ended");


