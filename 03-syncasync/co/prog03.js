#!/usr/bin/env node

// https://www.npmjs.com/package/co


// http://stackoverflow.com/questions/35639924/why-would-i-get-a-promise-is-not-defined-error-on-node-v5-7-0
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;

var co = require('co');
var fs = require("fs");


var readFile = function(filename, enc) {
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


var files = [
  'input1.txt',
  'input2.txt',
  'input3.txt',
  'input4.txt',
  'input5.txt'
];

var readMultipleFiles = co(
  function *(files) {
    var reads = [ ];
    //https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
    for(var i = 0; i < files.length; i++) {
      reads.push(readFile(files[i]));
    }
    return yield reads;
  },
  files
);

readMultipleFiles
  .then(function(values) {
    var result = '';
    for(var i = 0; i < values.length; i++) {
      str = values[i].toString().slice(0, -1);
      if(result && str) {
        result += ' ';
      }
      result += str;
    }
    console.log('"' + result + '"');
  }
);


// vim: set ts=2 sw=2 et:


