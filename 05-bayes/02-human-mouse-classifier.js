#!/usr/bin/env node

var bayes = require("bayes");
var classifier = bayes();
var fs = require("fs");
var readline = require("readline");


var learn_semaphore = 2;

var stream_mouse = fs.createReadStream("data/mouse2.train.txt");
var learning_set_mouse = readline.createInterface({
  input: stream_mouse
});
learning_set_mouse.on(
 "line",
 function(line) {
   classifier.learn(line, "mouse");
});
stream_mouse.on(
  'end',
  function() {
    onLearningFinished();
  }
);

var stream_human = fs.createReadStream("data/human2.train.txt");
var learning_set_human = readline.createInterface({
  input: stream_human
});
learning_set_human.on(
 "line",
 function(line) {
   classifier.learn(line, "human");
});
stream_human.on(
  'end',
  function() {
    onLearningFinished();
  }
);

var test_semaphore = 2;
var human_correct = 0;
var human_incorrect = 0;
var mouse_correct = 0;
var mouse_incorrect = 0;

function onLearningFinished()
{
  learn_semaphore--;
  if(learn_semaphore > 0) {
    return;
  }

  var stream_human = fs.createReadStream("data/human2.test.txt");
  var test_set_human = readline.createInterface({
    input: stream_human
  });
  test_set_human.on(
   "line",
   function(line) {
     if(classifier.categorize(line) == "human") {
       human_correct++;
     }
     else {
       human_incorrect++;
     }
  });
  stream_human.on(
    'end',
    function() {
      onTestFinished();
    }
  );

  var stream_mouse = fs.createReadStream("data/mouse2.test.txt");
  var test_set_mouse = readline.createInterface({
    input: stream_mouse
  });
  test_set_mouse.on(
   "line",
   function(line) {
     if(classifier.categorize(line) == "mouse") {
       mouse_correct++;
     }
     else {
       mouse_incorrect++;
     }
  });
  stream_mouse.on(
    'end',
    function() {
      onTestFinished();
    }
  );
  fs.writeFile(
    "data/classifier2.json",
    JSON.stringify(JSON.parse(classifier.toJson()), null, 2),
    function() { }
  );
}

function onTestFinished() {
  test_semaphore--;
  if(test_semaphore > 0) {
    return;
  }

  console.log("human:", human_correct / (human_correct + human_incorrect));
  console.log("mouse:", mouse_correct / (mouse_correct + mouse_incorrect));
}


// vim: set ts=2 sw=2 et:


