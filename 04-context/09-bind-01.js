#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let first_object = { 
  num: 42
};

let second_object = { 
  num: 23
};

function multiply(mult) {
  return this.num * mult; 
}

// this = first_object
let first_multiply = multiply.bind(first_object);
// this = second_object
let second_multiply = multiply.bind(second_object);

// 336 (42 * 8)
console.log(first_multiply(8));
// 184 (23 * 8)
console.log(second_multiply(8));


Function.prototype.bind2 = function(obj) {
  let method = this;
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
}

// this = first_object
let first_multiply2 = multiply.bind2(first_object);
// this = second_object
let second_multiply2 = multiply.bind2(second_object);

// 336 (42 * 8)
console.log(first_multiply(8));
// 184 (23 * 8)
console.log(second_multiply(8));


// vim: set ts=2 sw=2 et:


