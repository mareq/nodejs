#!/usr/bin/env node

// https://www.promisejs.org/generators/


function* count(){
  for(var x = 0; true; x++) {
    yield x
  }
}

for (var x of count()) {
  console.log(x)
}


// vim: set ts=2 sw=2 et:


