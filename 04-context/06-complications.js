#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let events = require('events');
let event_emitter = new events.EventEmitter();


function BigComputer(answer) { 
  this.the_answer = answer; 
  this.ask_question = function () { 
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
  // this = event_emitter (see 05-event-handler-02.js)
  event_emitter.on(
    'event1',
    deep_thought.ask_question
  );
}

add_handler();
event_emitter.emit('event1', 54);


// vim: set ts=2 sw=2 et:


