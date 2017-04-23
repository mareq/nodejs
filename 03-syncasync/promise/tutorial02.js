#!/usr/bin/env node

// https://strongloop.com/strongblog/promises-in-node-js-an-alternative-to-callbacks/


Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);


var promise1 = readFile('input.json');
var promise2 = promise1.then(
  function(data) {
    // if readFile was successful, let's readAnotherFile
    return readFile('input.json');
  },
  function(err) {
    // if readFile was unsuccessful, let's log it but still readAnotherFile
    console.error(err);
    return readFile('input.json');
  }
);
promise2.then(
  function(data) {
    console.log(data.toString());
  },
  console.error
);


// vim: set ts=2 sw=2 et:


