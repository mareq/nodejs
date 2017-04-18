#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm


var fs = require("fs");
var buf = new Buffer(1024);

console.log("Going to open an existing file");
fs.open(
  'input.txt',
  'r+',
  function(err, fd) {
    if(err) {
      return console.error(err);
    }
    console.log("File opened successfully!");
    console.log("Going to read the file");
    fs.read(
      fd,         // file descriptor
      buf,        // buffer
      0,          // offset
      buf.length, // length
      0,          // position
      function(err, bytes) {
        if(err) {
          console.log(err);
        }
        console.log(bytes + " bytes read");

        // Print only read bytes to avoid junk.
        if(bytes > 0) {
          console.log(buf.slice(0, bytes).toString());
        }
      }
    );
  }
);


