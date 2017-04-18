#!/usr/bin/env node

var path = require('path');
var fs = require('graceful-fs');
var chance = require('chance');
var spawn = require('child_process');


VERSION = '0.1'
CONFIG_FILE = path.join(__dirname, 'etc', 'data-generator.conf.json');


var config = JSON.parse(
  fs.readFileSync(CONFIG_FILE).toString()
);


var DATA_DIR = __dirname
config['data_dir'].forEach(function(dir) {
  DATA_DIR = path.join(DATA_DIR, dir)
});


// create random generator
console.log('using seed: ' + config['seed']);
var generator = new chance(config['seed']);

// generate language
console.log('generating language: ' + config['language_size'] + ' words');
var language = generator.n(generator.word, config['language_size']);
var keywords = language.slice(0, config['keywords_size']);

for(var article_no = 0; article_no < config['articles_cnt']; article_no++) {
  if(article_no % 1024 == 0) {
    console.log('generating articles: ' + article_no + '/' + config['articles_cnt']);
  }

  // pick keywords
  var keywords_n = generator.integer(
    {'min': config['keywords_min'], 'max': config['keywords_max']}
  );
  var keywords_arr = [ ];
  while(keywords_arr.length < keywords_n) {
    var word;
    word = keywords[generator.integer(
      {'min': 0, 'max': keywords.length - 1}
    )];
    if(word.length >= config['keyword_minlength'] && keywords_arr.indexOf(word) == -1) {
      keywords_arr.push(word);
    }
  }

  // pick title
  var titlewords_n = generator.integer(
    {'min': config['titlewords_min'], 'max': config['titlewords_max']}
  );
  var title_arr = [ ];
  while(title_arr.length < titlewords_n) {
    var word;
    if(generator.d100() <= config['titlekeyword_probability']) {
      word = keywords_arr[generator.integer(
        {'min': 0, 'max': keywords_arr.length - 1}
      )];
    }
    else {
      word = language[generator.integer(
        {'min': 0, 'max': language.length - 1}
      )];
    }
    if(title_arr.indexOf(word) == -1) {
      title_arr.push(word);
    }
  }
  var title_str = title_arr.join(' ');
  var title_str = title_str.charAt(0).toUpperCase() + title_str.slice(1);

  // generate text
  var paragraphs_n = generator.integer(
    {'min': config['articleparagraphs_min'], 'max': config['articleparagraphs_max']}
  );
  var paragraphs_arr = [ ];
  while(paragraphs_arr.length < paragraphs_n) {
    var sentences_n = generator.integer(
      {'min': config['paragraphsentences_min'], 'max': config['paragraphsentences_max']}
    );
    var sentences_arr = [ ];
    while(sentences_arr.length < sentences_n) {
      var words_n = generator.integer(
        {'min': config['sentencewords_min'], 'max': config['sentencewords_max']}
      );
      var words_arr = [ ];
      while(words_arr.length < words_n) {
        var word;
        if(generator.d100() <= config['sentencekeyword_probability']) {
          word = keywords_arr[generator.integer(
            {'min': 0, 'max': keywords_arr.length - 1}
          )];
        }
        else {
          word = language[generator.integer(
            {'min': 0, 'max': language.length - 1}
          )];
        }
        words_arr.push(word);
      }
      words_arr[0] = words_arr[0].charAt(0).toUpperCase() + words_arr[0].slice(1);
      sentences_arr.push(words_arr.join(' ') + '.');
    }
    paragraphs_arr.push(sentences_arr.join(' '));
  }
  var article = paragraphs_arr.join('\n\n');

  // create dir
  var target_dir = DATA_DIR;
  for(var dir_i = 0; dir_i < 2; dir_i++) {
    target_dir = path.join(target_dir, title_arr[dir_i].slice(0,2));
    try {
      fs.mkdirSync(target_dir);
    }
    catch(e) {
      if(e.code != 'EEXIST') throw e;
    }
  }

  // write metadata
  meta_json = {
    'title': title_str,
    'abstract': paragraphs_arr[0],
    'keywords': keywords_arr
  };
  var meta_str = JSON.stringify(meta_json);
  fs.writeFileSync(
    path.join(target_dir, title_arr.join('-') + '.meta'),
    meta_str,
    'UTF8'
  );

  // write data
  fs.writeFileSync(
    path.join(target_dir, title_arr.join('-') + '.data'),
    title_str + '\n\n' + article,
    'UTF8'
  );

  //console.log(meta_filename);
  //console.log(meta_str);
  //console.log('');
  //console.log(title_str);
  //console.log('keywords: ' + keywords_arr.join(', '));
  //console.log('');
  //console.log(article);
}



