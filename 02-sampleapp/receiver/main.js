#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert')
;
var mongoObjectId = require('mongodb').ObjectID;


VERSION = '0.1'
CONFIG_FILE = path.join(__dirname, 'etc', 'receiver.conf.json');


var config = JSON.parse(
  fs.readFileSync(CONFIG_FILE).toString()
);


var TMP_DIR = __dirname
config['tmp_dir'].forEach(function(dir) {
  TMP_DIR = path.join(TMP_DIR, dir)
});

var UPLOAD_DIR = __dirname
config['upload_dir'].forEach(function(dir) {
  UPLOAD_DIR = path.join(UPLOAD_DIR, dir)
});


index_content = {
  'version': VERSION,
  'actions': [
    {
      'href': '/',
      'rel': 'index',
      'method': 'GET'
    },
    {
      'href': '/data',
      'rel': 'upload',
      'method': 'POST'
    }
  ]
}

var app = express();

app.get(
  '/',
  function(http_req, http_res) {
    console.log('GET /');
    http_res.end(JSON.stringify(index_content));
  }
);

app.post(
  '/data',
  multer({"dest": TMP_DIR}).single('data'),
  function(http_req, http_res) {
    var data_file_name = http_req.file.originalname + '.gz';
    var sink = fs.createWriteStream(
      path.join(UPLOAD_DIR, data_file_name)
    )
    fs.createReadStream(http_req.file.path)
      .pipe(zlib.createGzip())
      .pipe(sink)
    ;

    sink.on(
      'finish',
      function() {
        mongoClient.connect(
          config['mongo_db_uri'],
          function(err, db) {
            if(err) {
              return console.error(err);
            }
            // blindly trusting data from outside: this would need some sanitizing in the real world...
            var meta = JSON.parse(http_req.body.meta);
            meta['data'] = data_file_name;
            db.collection('documents').insertOne(
              meta,
              function(err, db_res) {
                if(err) {
                  return console.error(err);
                }
                db.close();
                var res_str = '200 OK';
                http_res.end(res_str);

                console.log('POST /');
                console.log(http_req.body.meta);
                console.log(http_req.file.originalname);
                console.log(res_str);
              }
            )
          }
        );
      }
    );
  }
);

var server = app.listen(
  8082,
  function() {
    var host = server.address().address
    var port = server.address().port

    console.log('Receiver listening at http://%s:%s', host, port)
  }
);


// vim: set ts=2 sw=2 et:


