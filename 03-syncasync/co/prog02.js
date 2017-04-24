#!/usr/bin/env node

// https://www.npmjs.com/package/co


// http://stackoverflow.com/questions/35639924/why-would-i-get-a-promise-is-not-defined-error-on-node-v5-7-0
//var Promise = require('promise');
var Promise = require('es6-promise').Promise;

var co = require('co');


var fn1 = co.wrap(function *() {
  return yield Promise.resolve(42);
});

fn1().then(function(res) {
  console.log('fn1', res);
});


var fn2 = co.wrap(function *() {
  return yield [
    Promise.resolve(42),
    Promise.resolve(23),
    Promise.resolve(82),
    Promise.resolve(54),
  ];
});

fn2().then(function(res) {
  console.log('fn2', res);
});


var fn3 = co.wrap(function *() {
  return yield {
    a: Promise.resolve(42),
    b: Promise.resolve(23),
    c: Promise.resolve(82),
    d: Promise.resolve(54),
  };
});

fn3().then(function(res) {
  console.log('fn3', res);
});


var fn4 = co.wrap(
  function *(argument) {
    return yield Promise.resolve(argument);
  }
);

fn4(42).then(function(res) {
  console.log('fn4', res);
});


// vim: set ts=2 sw=2 et:


