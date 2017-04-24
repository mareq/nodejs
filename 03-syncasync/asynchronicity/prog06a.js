#!/usr/bin/env node


var Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);

function async(makeGenerator) {
  return function () {
    // this will call readFile and schedule I/O operation,
    // which will never be executed
    var generator = makeGenerator.apply(this, arguments);

    function handle(result) {
      // result => { done: [Boolean], value: [Object] }
      if(result.done) {
        // this point is never reached ...
        console.log('This point is never reached!');
        return Promise.resolve(result.value);
      }

      console.log('Only this point is reached...');
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
    // ... and therefore this point is never reached neither ...
    console.log('This point is never reached!');
    return buf.toString();
  }
);

function doRead() {
  var counter = g_counter++;
  asyncRead(counter)
    .then(function(data) {
      // ... and therefore neither this point can ever be reached
      console.log('This point is never reached!');
      cpuIntensiveDelay();
      console.log('Asynchronous read finish:', counter);
    }
  );
}


var g_counter = 0;

while(true) {
  doRead();
}


console.log('End of the script');


// vim: set ts=2 sw=2 et:


