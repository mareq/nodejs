#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm


var fs = require("fs");

console.log("Going to read directory");
fs.readdir(
  "..",
  function(err, files) {
    if(err) {
      return console.error(err);
    }
    files.forEach(function(file) {
      console.log(file);
    });
  }
);


