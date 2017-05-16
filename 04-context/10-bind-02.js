#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let events = require('events');
let event_emitter = new events.EventEmitter();


function BigComputer(answer) { 
  this.the_answer = answer; 
  this.ask_question = function() { 
    // 42
    console.log(this.the_answer);
    // BigComputer { the_answer: 42, ask_question: [Function] }
    console.log(this);
  }
}

function add_handler() {
  let deep_thought = new BigComputer(42);
  // this = deep_thought
  event_emitter.on(
    'event1',
    deep_thought.ask_question.bind(deep_thought)
  );
}

add_handler();
event_emitter.emit('event1', 54);


// vim: set ts=2 sw=2 et:


