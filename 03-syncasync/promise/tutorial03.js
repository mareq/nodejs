#!/usr/bin/env node

// http://stackabuse.com/node-js-async-await-in-es7/


Promise = require('promise');

var readFile = Promise.denodeify(require('fs').readFile);


console.log(doRead());

async function doRead()
{
  return await readFile('input.json');
}


// vim: set ts=2 sw=2 et:


