#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_event_emitter.htm


var events = require('events');
var eventEmitter = new events.EventEmitter();

// new listener
var newListener = function newListener(ev, listener) {
  listenerStr = listener.toString();
  listenerStr = listenerStr.substr('function '.length);
  listenerStr = listenerStr.substr(0, listenerStr.indexOf('('));

  console.log('listener added: ' + ev + ':' + listenerStr);
}

// remove listener
var removeListener = function removeListener(ev, listener) {
  listenerStr = listener.toString();
  listenerStr = listenerStr.substr('function '.length);
  listenerStr = listenerStr.substr(0, listenerStr.indexOf('('));

  console.log('listener removed: ' + ev + ':' + listenerStr);
}

eventEmitter.on('removeListener', removeListener);
eventEmitter.on('newListener', newListener);


// listener #1
var listner1 = function listner1() {
  console.log('listner1 executed.');
}

// listener #2
var listner2 = function listner2() {
  console.log('listner2 executed.');
}

// Bind the connection event with the listner1 function
eventEmitter.addListener('connection', listner1);

// Bind the connection event with the listner2 function
eventEmitter.on('connection', listner2);

var eventListeners = require('events').EventEmitter.listenerCount(
  eventEmitter,
  'connection'
);

console.log(eventListeners + " Listner(s) listening to connection event");

// Fire the connection event 
eventEmitter.emit('connection');

// Remove the binding of listner1 function
eventEmitter.removeListener('connection', listner1);

eventListeners = require('events').EventEmitter.listenerCount(
  eventEmitter,
  'connection'
);
console.log(eventListeners + " Listner(s) listening to connection event");

// Fire the connection event 
console.log("Listner1 will not listen now.");
eventEmitter.emit('connection');


console.log("Program Ended.");


