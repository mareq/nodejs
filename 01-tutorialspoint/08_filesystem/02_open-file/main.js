#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm


var fs = require("fs");

// Asynchronous - Opening File
console.log("Going to open file!");
fs.open(
  'input.txt',
  'r+',
  function(err, fd) {
    if(err) {
      return console.error(err);
    }
    console.log("File opened successfully: " + fd);
  }
);


