#!/usr/bin/env node

var bayes = require('bayes');
var classifier = bayes();


var learning_set = {
  // source: http://scv.bu.edu/~aarondf/b5quotes.html
  b5: [
    "I was there, at the dawn of the Third Age of Mankind. It began in the Earth year 2257 with the founding of the last of the Babylon stations, located deep in neutral space. It was a port of call for refugees, smugglers, businessmen, diplomats and travelers from a hundred worlds. It could be a dangerous place, but we accepted the risk because Babylon 5 was our last, best hope for peace. Under the leadership of its final commander, Babylon 5 was a dream given form, a dream of a galaxy without war, when species from different worlds could live side-by-side in mutual respect, a dream that was endangered as never before by the arrival of one man on a mission of destruction. Babylon 5 was the last of the Babylon stations. This is its story.",
    "Sooner or later, everyone comes to Babylon 5.",
    "Would you prefer to be conscious or unconscious during the mating? I would prefer conscious, but I don't know what your .. pleasure threshold is.",
    "It was the Dawn of the Third Age of Mankind, ten years after the Earth-Minbari War. The Babylon Project was a dream given form. Its goal: to prevent another war by creating a place where humans and aliens could work out their differences peacefully. It's a port of call, home away from home for diplomats, hustlers, entrepreneurs and wanderers. Humans and aliens wrapped in two million, five hundred thousand tons of spinning metal .. all alone in the night. It can be a dangerous place, but it's our last, best hope for peace. -- This is the story of the last of the Babylon stations. The year is 2258. The name of the place is Babylon 5.",
    "The wheel turns, does it not, Ambassador?",
    "Commander, please. On the issue of galactic peace, I am long past innocence and fast approaching apathy. It's all a game -- a paper fantasy of names and borders. Only one thing matters, Commander. Blood calls out for blood.",
    "I will confess that I look forward to the day when we have cleansed the Universe of the Centauri and carved their bones into little flutes for Narn children. It is a dream I have.",
    "Be careful, Ambassador. Not every dream I've heard lately ends well for you.",
    "They are alone. They are a dying people. We should let them pass.",
  ],
  // source: http://www.sjtrek.com/trek/quotes/S_TheNextGeneration/
  tng: [
    "But this is the court of the year 2079, by which time all 'United Earth' nonsense had been abolished",
    "Well it's a new ship - but she's got the right name. Now you remember that, you hear?",
    "You treat her like a lady, and she'll always bring you home",
    "Seize the time, Meribor. Live now; make now always the most precious time. Now will never come again",
    "Shields up! Red alert!",
    "Eaten any good books lately?",
    "You're so stolid. You weren't like that before the beard.",
    "Our neural pathways have become accustomed to your sensory input patterns.",
  ],
};

learning_set.b5.forEach(function(element) {
  classifier.learn(element, 'b5');
});
learning_set.tng.forEach(function(element) {
  classifier.learn(element, 'tng');
});

console.log(JSON.stringify(JSON.parse(classifier.toJson()), null, 2));

console.log(classifier.categorize(
  "There are things in the Universe billions of years older than either of our races. They are vast, timeless, and if they are aware of us at all, it is as little more than ants and we have as much chance of communicating with them as an ant has with us. We know. We've tried and we've learned that we can either stay out from underfoot or be stepped on. They are a mystery and I am both terrified and reassured to know that there are still wonders in the Universe, that we have not explained everything. Whatever they are, Miss Sakai, they walk near Sigma 957 and they must walk there alone."
));
console.log(classifier.categorize(
  "Every damn patient who comes through that door, that's who! People come to doctors because they want us to be gods. They want us to make it better .. or make it not so. They want to be healed and they come to me when their prayers aren't enough. Well, if I have to take the responsibility, then I claim the authority too. I did good. And we both know it. And no-one is going to take that away."
));



// vim: set ts=2 sw=2 et:


