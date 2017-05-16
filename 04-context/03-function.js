#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


function test_this() { 
  return this; 
} 

// this = global context
let i_wonder_what_this_is = test_this();

// see 03-function.out
console.log('i_wonder_what_this_is', i_wonder_what_this_is);


// vim: set ts=2 sw=2 et:


