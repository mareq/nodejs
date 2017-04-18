#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_callbacks_concept.htm


var fs = require("fs");

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended");


