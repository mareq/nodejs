#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let events = require('events');
let event_emitter = new events.EventEmitter();


function BigComputer(answer) { 
  this.the_answer = answer; 
  this.ask_question = function() { 
    // undefined
    console.log(this.the_answer);
    // EventEmitter {
    //  domain: null,
    //  _events: { event1: [Function] },
    //  _eventsCount: 1,
    //  _maxListeners: undefined }
    console.log(this);
  }
}

function add_handler() {
  let deep_thought = new BigComputer(42);
  // TypeError: "listener" argument must be a function
  // the ask_question function is executed immediately
  // and its return value is passed as an argument instead
  // of passing the function itself - hence the error
  event_emitter.on(
    'event1',
    deep_thought.ask_question.call(deep_thought)
  );
}

add_handler();
event_emitter.emit('event1', 54);


// vim: set ts=2 sw=2 et:


