#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_global_objects.htm


// Let's try to print the value of __filename
console.log(__filename);

// Let's try to print the value of __dirname
console.log(__dirname);

function printHello1(){
  console.log( "Hello, World! #1");
}
// Now call above function after 2 seconds
setTimeout(printHello1, 2000);

function printHello2(){
  console.log( "Hello, World! #2");
}
// Now call above function after 2 seconds
var t = setTimeout(printHello2, 2000);
// Now clear the timer
clearTimeout(t);

function printHello3(){
  console.log( "Hello, World! #3");
}
// Now call above function after 2 seconds
setInterval(printHello3, 2000);


