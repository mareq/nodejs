#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm


var fs = require("fs");

console.log("Going to get file info!");
fs.stat(
  'input.txt',
  function (err, stats) {
    if(err) {
      return console.error(err);
    }

    console.log(stats);
    console.log("Got file info successfully!");

    // Check file type
    console.log("isFile ? " + stats.isFile());
    console.log("isDirectory ? " + stats.isDirectory());
  }
);


