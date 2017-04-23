#!/usr/bin/env node


var Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);


var g_counter = 0;

doRead();

function doRead() {
  var counter = g_counter++;
  Promise
    .resolve()
    .then(function() {
    })
    .then(function() {
      // despite crossing .then, this will still result in I/O operation
      // not being executed at all
      //doRead();
    })
    .then(function() {
    })
    .then(function() {
      console.log('Asynchronous read: start:', counter);
      var p = readFile('input.txt');
      // despite crossing .then, this will still result in I/O operation
      // not being executed at all
      doRead();
      return p;
    })
    .then(function(data) {
      cpuIntensiveDelay();
      console.log('Asynchronous read finish:', counter);
    })
    .catch(console.error)
  ;
}


function cpuIntensiveDelay() {
  for(var i = 0; i < 1024*1024*1024; i++);
}

console.log('End of the script');


// vim: set ts=2 sw=2 et:


