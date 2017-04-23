#!/usr/bin/env node


var Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);


var g_counter = 0;

while(true) {
  var counter = g_counter++;
  console.log('Asynchronous read: start:', counter);
  readFile('input.txt')
    .then(function(data) {
      // this is asynchronous completion handler for I/O operation (file read);
      // it will never be executed even though it has been enqueued many times,
      // because the infinite loop is sunchronous code that has to be finished
      // first, before executing any enqueued I/O operations and/or functions
      console.log('This point is never reached!');
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


