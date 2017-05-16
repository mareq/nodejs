#!/usr/bin/env node


// http://wesbos.com/let-vs-const/


const gkar = {
  name: "G'Kar",
  race: "Narn",
  title: "ambassador, member of the third circle of the Kha'Ri"
};
// update allowed
gkar.title = "citizen";
// gkar { name: 'G\'Kar', race: 'Narn', title: 'citizen' }
console.log('gkar', gkar);

const delenn = Object.freeze({
  name: "Delenn",
  race: "Minbari",
  title: "ambassador, Satai"
});
// update silently ignored
delenn.race = "Human"
// delenn { name: 'Delenn', race: 'Minbari', title: 'ambassador, Satai' }
console.log('delenn', delenn);


// vim: set ts=2 sw=2 et:


