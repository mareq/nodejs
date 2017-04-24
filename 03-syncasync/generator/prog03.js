#!/usr/bin/env node

// https://davidwalsh.name/es6-generators


function *foo(x) {
  // out: x + 1 = 5 + 1 = 6
  // in: 12
  var y = 2 * (yield (x + 1));

  // out: y / 3 = (2 * 12) / 3 = 8
  // in: 13
  var z = yield (y / 3);


  // out: x + y + z = 5 + (2 * 12) + 13 = 5 + 24 + 13 = 42
  return (x + y + z);
}

var it = foo(5);

// note: not sending anything into next() here
console.log(it.next());     // { value:6, done:false }
console.log(it.next(12));   // { value:8, done:false }
console.log(it.next(13));   // { value:42, done:true }

console.log();

// 6
// NaN   note: can not pass values to next() (next is not exposed by for..of)
//       note: return is ignored
for(x of foo(5)) {
  console.log(x);
}


// vim: set ts=2 sw=2 et:


