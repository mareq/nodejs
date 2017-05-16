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

// NaN
console.log(
  // this = global context (there is no this.num)
  multiply(first_object, 8)
);

// 336 (42 * 8)
console.log(
  // this = first_object
  multiply.call(first_object, 8)
);

// 336 (42 * 8)
console.log(
  // this = first_object
  multiply.apply(first_object, [ 8 ])
);

// 184 (23 * 8)
console.log(
  // this = second_object
  multiply.call(second_object, 8)
);

// 184 (23 * 8)
console.log(
  // this = second_object
  multiply.apply(second_object, [ 8 ])
);


// vim: set ts=2 sw=2 et:


