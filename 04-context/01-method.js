#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let deep_thought = {
  the_answer: 42,
  ask_question: function() {
    return this.the_answer;
  }
};

// this = deep_thought
let meaning = deep_thought.ask_question(); 

// deep_thought { the_answer: 42, ask_question: [Function: ask_question] }
console.log('deep_thought', deep_thought);
// meaning 42
console.log('meaning', meaning);


// vim: set ts=2 sw=2 et:


