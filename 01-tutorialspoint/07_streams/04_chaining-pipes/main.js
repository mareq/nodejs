#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_streams.htm


var fs = require("fs");
var zlib = require('zlib');

// Compress the file input.txt to input.txt.gz
var gz = fs.createWriteStream('input.txt.gz')
var fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(gz)
;

console.log("File Compressed.");

// Decompress the file input.txt.gz to output.txt
gz.on(
 'finish',
 function() {
    fs.createReadStream('input.txt.gz')
      .pipe(zlib.createGunzip())
      .pipe(fs.createWriteStream('output.txt'))
    ;
 }
);

console.log("File Decompressed.");


