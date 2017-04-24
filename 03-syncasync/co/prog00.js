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


//var fn = co(function *() {
  //var res = yield [
    //Promise.resolve(1),
    //Promise.resolve(2),
    //Promise.resolve(3),
  //];

  //console.log(res);
//});

//fn.then(function(res) {
  //console.log(res);
//});

var files = [
  'input1.txt',
  'input2.txt',
  'input3.txt',
  'input4.txt',
  'input5.txt'
];
var readMultipleFiles = co.wrap(
  function *(files) {
    // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
    //var reads = [ ];
    //for(var i = 0; i < files.length; i++) {
      //reads.push(readFile(files[i]));
    //}
    //yield reads;
    yield readFile(files[0]);
  },
  files
);
readMultipleFiles(files).then(function(value) {
  console.log(value);
});

//readMultipleFiles(files)
  //.then(function(data) {
    //console.log('"' + data + '"');
  //})
//;


// vim: set ts=2 sw=2 et:


