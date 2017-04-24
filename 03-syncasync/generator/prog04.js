#!/usr/bin/env node

// https://davidwalsh.name/es6-generators


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


var readMultipleFiles = async(
  function *(files) {
    var result = '';
    // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
    for(var i = 0; i < files.length; i++) {
      var buf = yield readFile(files[i]);
      str = buf.toString().slice(0, -1);
      if(result && str) {
        result += ' ';
      }
      result += str;
    }
    return result;
  }
);

var files = [
  'input1.txt',
  'input2.txt',
  'input3.txt',
  'input4.txt',
  'input5.txt'
];
readMultipleFiles(files)
  .then(function(data) {
    console.log('"' + data + '"');
  })
;


// vim: set ts=2 sw=2 et:


