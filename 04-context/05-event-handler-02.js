#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


let events = require('events');
let event_emitter = new events.EventEmitter();


// this = event_emitter
function handler1(value1) {
  // handler1 EventEmitter {
  //  domain: null,
  //  _events:
  //   { event1: [Function: handler1],
  //     event2: [Function: handler2],
  //     event3: [Function] },
  //  _eventsCount: 3,
  //  _maxListeners: undefined }
  console.log('handler1', this);
  // value1 42
  console.log('value1', value1);
}
event_emitter.on(
  'event1',
  handler1
);

// this = event_emitter
event_emitter.on(
  'event2',
  function handler2(value2) {
    // handler2 EventEmitter {
    //   domain: null,
    //   _events:
    //    { event1: [Function: handler1],
    //      event2: [Function: handler2],
    //      event3: [Function] },
    //   _eventsCount: 3,
    //   _maxListeners: undefined }
    console.log('handler2', this);
    // value2 23
    console.log('value2', value2);
  }
);

// this = { }
event_emitter.on(
  'event3',
  value3 => {
    // handler3 {}
    console.log('handler3', this);
    // value3 82
    console.log('value3', value3);
  }
);

event_emitter.emit('event1', 42);
console.log()
event_emitter.emit('event2', 23);
console.log()
event_emitter.emit('event3', 82);
console.log()


// vim: set ts=2 sw=2 et:


