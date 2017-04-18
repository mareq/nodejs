#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_callbacks_concept.htm


var fs = require("fs");

fs.readFile(
  'input.txt',
  function(err, data) {
    if(err) {
      return console.error(err);
    }
    console.log(data.toString());
  }
);

console.log("Program Ended");


