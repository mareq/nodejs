#!/usr/bin/env node


var fs = require("fs");


var g_counter = 0;

// infinite loop
while(true) {
  startRead();
}

function startRead() {
  var counter = g_counter++;
  console.log('Asynchronous read: start:', counter);
  fs.readFile(
    'input.txt',
    function(err, data) {
      finishRead(err, data, counter);
    }
  );
}

function finishRead(err, data, counter) {
  // this point never gets reached, even after enqueueing many I/O operations
  // and their completion handlers
  console.log('This point is never reached!');

  if(err) {
    return console.error(err);
  }
  console.log('Asynchronous read finish:', counter);
}

console.log('End of the script');


// vim: set ts=2 sw=2 et:


