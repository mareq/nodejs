#!/usr/bin/env node

// https://www.promisejs.org/generators/


var fs = require("fs");
Promise = require('promise');


readJSON('./input.json')
  .then(function(res) {
    console.log(res);
  })
;

function readFile(filename, enc) {
  return new Promise(function(fulfill, reject) {
    fs.readFile(
      filename,
      enc,
      function(err, res) {
        if(err) {
          reject(err);
        }
        else {
          fulfill(res);
        }
      }
    );
  });
}


function readJSON(filename) {
  return readFile(filename, 'utf8')
    .then(JSON.parse)
  ;
}


// vim: set ts=2 sw=2 et:


