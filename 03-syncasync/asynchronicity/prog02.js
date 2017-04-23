#!/usr/bin/env node


var fs = require("fs");


var g_counter = 0;

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

  // (relatively) long blocking delay
  cpuIntensiveDelay();
}

function finishRead(err, data, counter) {
  // despite the delay, this code is still synchronous and will not allow
  // neither I/O, nor asynchronous functions to be executed

  // this point never gets reached, even after enqueueing many I/O operations
  // and their completion handlers - despite the long blocking delay
  // in the startRead function above
  console.log('This point is never reached!');

  if(err) {
    return console.error(err);
  }
  console.log('Asynchronous read finish:', counter);
}

function cpuIntensiveDelay() {
  for(var i = 0; i < 1024*1024*1024; i++);
}

console.log('End of the script');


// vim: set ts=2 sw=2 et:


