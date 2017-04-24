#!/usr/bin/env node


var Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);

function async(makeGenerator) {
  return function () {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result) {
      // result => { done: [Boolean], value: [Object] }
      if(result.done) {
        return Promise.resolve(result.value);
      }

      return Promise.resolve(result.value)
        .then(function (res) {
          return handle(generator.next(res));
        },
        function (err) {
          return handle(generator.throw(err));
        }
      );
    }

    try {
      return handle(generator.next());
    }
    catch(err) {
      return Promise.reject(err);
    }
  }
}

var asyncRead = async(
  function *(counter) {
    console.log('Asynchronous read: start:', counter);
    var buf = yield readFile('input.txt');
    return buf.toString();
  }
);

function doRead() {
  // this would cause stack overflow: executes the function BEFORE
  // any I/O operatons take place and since file read operation needs
  // to finish before its completion handler will be enqueued, this
  // will produce infinite recursion, which very fast consumes whole stack
  //process.nextTick(doRead);

  // enqueue next execution of the doRead function, but allow I/O operations
  // to run BEFORE the enqueued function itself - this allows for the file read
  // operation to run, finish and enqueue its completion handler
  setImmediate(doRead);

  var counter = g_counter++;
  asyncRead(counter)
    .then(function() {
      cpuIntensiveDelay();
      console.log('Asynchronous read finish:', counter);
    }
  );
}


var g_counter = 0;

doRead();


function cpuIntensiveDelay() {
  for(var i = 0; i < 1024*1024*1024; i++);
}

console.log('End of the script');


// vim: set ts=2 sw=2 et:


