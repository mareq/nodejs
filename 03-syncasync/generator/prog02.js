#!/usr/bin/env node

// https://davidwalsh.name/es6-generators


function foo(x) {
  console.log('foo:', x);
}

function *bar() {
  console.log('bar: begin');

  yield undefined; // just pause
  console.log('bar: resume #1');

  foo(yield undefined); // pause waiting for a parameter to pass into foo(..)
  console.log('bar: resume #2');

  console.log('bar: end');
}


var it1 = bar();
console.log(it1.next());
console.log(it1.next());
console.log(it1.next());

console.log();

var it2 = bar(1);
console.log(it2.next(2));
console.log(it2.next(3));
console.log(it2.next(4));


// vim: set ts=2 sw=2 et:


