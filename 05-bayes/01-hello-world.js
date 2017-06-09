#!/usr/bin/env node

var bayes = require("bayes");
var classifier = bayes();
var fs = require("fs");
var readline = require("readline");


// b5 source: http://scv.bu.edu/~aarondf/b5quotes.html
// tng source: http://www.sjtrek.com/trek/quotes/S_TheNextGeneration/

var semaphore = 2;

var stream_b5 = fs.createReadStream("01-learning_set-b5.txt");
var learning_set_b5 = readline.createInterface({
  input: stream_b5
});
learning_set_b5.on(
 "line",
 function(line) {
   classifier.learn(line, "b5");
});
stream_b5.on(
  'end',
  function() {
    onLearningFinished();
  }
);

var stream_tng = fs.createReadStream("01-learning_set-tng.txt");
var learning_set_tng = readline.createInterface({
  input: stream_tng
});
learning_set_tng.on(
 "line",
 function(line) {
   classifier.learn(line, "tng");
});
stream_tng.on(
  'end',
  function() {
    onLearningFinished();
  }
);

function onLearningFinished()
{
  semaphore--;
  if(semaphore > 0) {
    return;
  }

  console.log(JSON.stringify(JSON.parse(classifier.toJson()), null, 2));

  console.log(classifier.categorize(
    "There are things in the Universe billions of years older than either of our races. They are vast, timeless, and if they are aware of us at all, it is as little more than ants and we have as much chance of communicating with them as an ant has with us. We know. We've tried and we've learned that we can either stay out from underfoot or be stepped on. They are a mystery and I am both terrified and reassured to know that there are still wonders in the Universe, that we have not explained everything. Whatever they are, Miss Sakai, they walk near Sigma 957 and they must walk there alone."
  ));
  console.log(classifier.categorize(
    "Every damn patient who comes through that door, that's who! People come to doctors because they want us to be gods. They want us to make it better .. or make it not so. They want to be healed and they come to me when their prayers aren't enough. Well, if I have to take the responsibility, then I claim the authority too. I did good. And we both know it. And no-one is going to take that away."
  ));
}



// vim: set ts=2 sw=2 et:


