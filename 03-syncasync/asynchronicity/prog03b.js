#!/usr/bin/env node


var fs = require("fs");


var g_counter = 0;

startRead();

function startRead() {
  // this would cause stack overflow: executes the function BEFORE
  // any I/O operatons take place and since file read operation needs
  // to finish before its completion handler will be enqueued, this
  // will produce infinite recursion, which very fast consumes whole stack
  //process.nextTick(startRead);

  // enqueue next execution of the startRead function, but allow I/O operations
  // to run BEFORE the enqueued function itself - this allows for the file read
  // operation to run, finish and enqueue its completion handler
  setImmediate(startRead);

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


