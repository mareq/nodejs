#!/usr/bin/env node


// http://wesbos.com/let-vs-const/


const key = 'abc123';
let points = 50;
var penalty = 2;
let winner = false;
var loser = true;

if(points > 40) {
  // local scope variable (overshadows the one on the parent scope)
  let winner = true
  // global scope variable (same as the one on the parent scope)
  var loser = false;
}

// SyntaxError: Identifier 'points' has already been declared
//let points = 60;

// var allows redefinition
var penalty = 8;

// TypeError: Assignment to constant variable.
//key = 'def456'

// key abc123
console.log('key', key);
// points 50
console.log('points', points);
// penalty 8
console.log('penalty', penalty);
// winner false
console.log('winner', winner);
// loser false
console.log('loser', loser);


// vim: set ts=2 sw=2 et:


