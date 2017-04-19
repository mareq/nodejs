#!/usr/bin/env node

// http://stackoverflow.com/questions/25344879/uploading-file-using-post-request-in-node-js


var request = require('request');
var file = require('file');
var fs = require('fs');
var path = require('path');


VERSION = '0.1'
CONFIG_FILE = path.join(__dirname, 'etc', 'sender.conf.json');


var config = JSON.parse(
  fs.readFileSync(CONFIG_FILE).toString()
);

var DATA_DIR = __dirname
config['data_dir'].forEach(function(dir) {
  DATA_DIR = path.join(DATA_DIR, dir)
});


console.log('sending data from root directory: ' + DATA_DIR);
file.walk(
  DATA_DIR,
  function(err, dir_path, dirs, files) {
    if(err) {
      return console.error(err);
    }
    sendFiles(dir_path, files);
  }
);

function sendFiles(dir_path, files)
{
  files
    .filter(function(file) {
      return file.substr(-5) === '.meta';
    })
    .forEach(function(file) {
      var name = path.basename(file.slice(0, -5));
      sendFile(dir_path, name);
    })
  ;
}

function sendFile(dir_path, name)
{
  var metadata = fs.readFile(
    path.join(dir_path, name + '.meta'),
    function(err, raw_meta) {
      if(err) {
        return console.error(err);
      }
      sendData(
        name,
        JSON.parse(raw_meta), 
        fs.createReadStream(path.join(dir_path, name + '.data'))
      );
    }
  );
}

function sendData(name, meta, data_stream)
{
  meta['source'] = config['data_source'];

  var req = request.post(
    config['sink_url'],
    function(err, res, body) {
      if(err) {
        console.log(err);
      }
      else {
        console.log(name);
        console.log(meta);
        console.log(body);
      }
    }
  );
  var form = req.form();

  form.append(
    'meta',
    JSON.stringify(meta),
    {
      contentType: 'application/x-www-form-urlencoded'
    }
  );

  form.append(
    'data',
    data_stream
  );
}


// vim: set ts=2 sw=2 et:


