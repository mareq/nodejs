#!/usr/bin/env node


var fs = require("fs");


var g_counter = 0;

while(true) {
  console.log('This is a trap!');

  // this enqueues execution of startRead, but startRead never gets called,
  // because current synchronous code (the infinite loop) has to be finished
  // first, before executing any enqueued I/O operations and/or functions
  setImmediate(startRead);
}

function startRead() {
  console.log('This point is never reached!');

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
  if(err) {
    return console.error(err);
  }
  cpuIntensiveDelay();
  console.log('Asynchronous read finish:', counter);
}

function cpuIntensiveDelay() {
  for(var i = 0; i < 1024*1024*1024; i++);
}

console.log('End of the script');


// vim: set ts=2 sw=2 et:


