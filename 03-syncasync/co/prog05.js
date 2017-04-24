#!/usr/bin/env node

// https://www.npmjs.com/package/co-walk


// http://stackoverflow.com/questions/35639924/why-would-i-get-a-promise-is-not-defined-error-on-node-v5-7-0
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;

var co = require('co');
var co_walk = require('co-walk');


var getFiles = co.wrap(function *() {
  return yield co_walk(__dirname);
});

getFiles().then(function(value) {
  // all files are accumulated and only then returned in single go
  console.log('vvvvvvvv');
  console.log(value);
  console.log('^^^^^^^^');
});


// vim: set ts=2 sw=2 et:


