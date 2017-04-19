#!/usr/bin/env node

// http://stackoverflow.com/questions/5172244/idiomatic-way-to-wait-for-multiple-callbacks-in-node-js


var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var zlib = require('zlib');
var xxh = require('xxhashjs');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert')
;
var mongoObjectId = require('mongodb').ObjectID;


VERSION = '0.1';
CONFIG_FILE = path.join(__dirname, 'etc', 'receiver.conf.json');
XXH_SEED = 0xACDC;


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

app.get('/', httpRqtIndex);

app.post(
  '/data',
  multer({"dest": TMP_DIR}).single('data'),
  httpRqtDataUpload
);

var server = app.listen(
  8082,
  function() {
    var host = server.address().address
    var port = server.address().port

    console.log('Receiver listening at http://%s:%s', host, port)
  }
);

function httpRqtIndex(http_req, http_res) {
  console.log('GET /');
  http_res.end(JSON.stringify(index_content));
}

function httpRqtDataUpload(http_req, http_res) {
  var data_target_file_name = http_req.file.originalname + '.gz';
  var data_target_file_hash = xxh.h32(data_target_file_name, XXH_SEED).toString(16);
  var data_target_file_dir = "";
  for(i = 0; i < 4 && i < data_target_file_hash.length; i++) {
    data_target_file_dir = path.join(
      data_target_file_dir,
      data_target_file_hash.charAt(i)
    );
  }
  async.parallel(
    {
      store_data: function(callback) {
        storeData(
          http_req.file.path,
          data_target_file_dir,
          data_target_file_name,
          callback
        );
      },
      store_metadata: function(callback) {
        // blindly trusting data from outside: this would need some sanitizing
        // in the real world...
        storeMetaData(
          JSON.parse(http_req.body.meta),
          data_target_file_dir,
          data_target_file_name,
          callback
        )
      }
    },
    function(err, res) {
      if(err) {
        return console.error(err);
      }
      var res_str = '200 OK';
      http_res.end(res_str);

      console.log('POST /');
      console.log(res);
      console.log(res_str);
    }
  );
}

function storeData(
  data_source_path,
  data_target_file_dir,
  data_target_file_name,
  callback
) {
  var data_target_path = path.join(UPLOAD_DIR, data_target_file_dir);
  mkdirp.sync(data_target_path);
  var sink = fs.createWriteStream(path.join(
    data_target_path,
    data_target_file_name
  ));
  fs.createReadStream(data_source_path)
    .pipe(zlib.createGzip())
    .pipe(sink)
  ;
  sink.on(
    'finish',
    function() {
      callback(
        null,
        {
          path: data_target_path
        }
      )
    }
  );
}

function storeMetaData(
  meta,
  data_target_file_dir,
  data_target_file_name,
  callback
) {
  mongoClient.connect(
    config['mongo_db_uri'],
    function(err, db) {
      if(err) {
        callback(err, null);
      }
      meta['data_dir'] = data_target_file_dir;
      meta['data_file'] = data_target_file_name;
      db.collection('documents').insertOne(
        meta,
        function(err, db_res) {
          db.close();
          if(err) {
            return callback(err, null);
          }
          callback(null, meta);
        }
      )
    }
  );
}


// vim: set ts=2 sw=2 et:


