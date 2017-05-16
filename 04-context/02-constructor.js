#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


function BigComputer(answer) { 
  this.the_answer = answer; 
  this.ask_question = function() { 
    return this.the_answer; 
  }
}

// this = new object (new BigComputer)
let deep_thought = new BigComputer(42); 

// deep_thought BigComputer { the_answer: 42, ask_question: [Function] }
console.log('deep_thought', deep_thought);
// meaning 42
console.log('meaning', deep_thought.ask_question());


// vim: set ts=2 sw=2 et:


