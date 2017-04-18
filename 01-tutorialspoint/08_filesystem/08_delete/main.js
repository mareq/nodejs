#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm


var fs = require("fs");

fs.writeFile(
  'input.txt',
  'Simply Easy Learning!',
  function(err) {
    if(err) {
      return console.error(err);
    }

    console.log("Going to delete an existing file");
    fs.unlink(
      'input.txt',
      function(err) {
        if(err) {
          return console.error(err);
        }
        console.log("File deleted successfully!");
      }
    );
  }
);


