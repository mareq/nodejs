#!/usr/bin/env node


// http://www.digital-web.com/articles/scope_in_javascript/


// this = Timeout
function handler1() {
  // handler1 Timeout {
  //   _called: true,
  //   _idleTimeout: 1,
  //   _idlePrev: null,
  //   _idleNext: null,
  //   _idleStart: 56,
  //   _onTimeout: [Function: handler1],
  //   _timerArgs: undefined,
  //   _repeat: null }
  console.log('handler1', this);
  console.log();
}
setTimeout(
  handler1,
  0
);

// this = Timeout
setTimeout(
  function handler2() {
    // handler2 Timeout {
    //   _called: true,
    //   _idleTimeout: 1,
    //   _idlePrev: null,
    //   _idleNext: null,
    //   _idleStart: 57,
    //   _onTimeout: [Function: handler2],
    //   _timerArgs: undefined,
    //   _repeat: null }
    console.log('handler2', this);
    console.log();
  },
  0
);

// this = { }
setTimeout(
  () => {
    // handler3 {}
    console.log('handler3', this);
    console.log();
  },
  0
);


// vim: set ts=2 sw=2 et:


