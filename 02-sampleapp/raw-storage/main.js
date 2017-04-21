#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var async = require('async');
var zmq = require('zmq');
//var express = require('express');
//var router = express.Router();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient,
  co = require('co'),
  assert = require('assert')
;


VERSION = '0.1';
CONFIG_FILE = path.join(__dirname, 'etc', 'raw-storage.conf.json');


var config = JSON.parse(
  fs.readFileSync(CONFIG_FILE).toString()
);

var DATA_DIR = __dirname
config['data_dir'].forEach(function(dir) {
  DATA_DIR = path.join(DATA_DIR, dir)
});


var responder = zmq.socket('rep');
responder.on(
  'message',
  function(rqt) {
    dispatchRequest(
      rqt.toString(),
      function(result) {
        responder.send(JSON.stringify(result['res']));
        console.log(result);
      }
    )
  }
);

responder.bind(
  config['listen_addr'],
  function(err) {
    if(err) {
      return console.error(err);
    }
    console.log('Raw Storage listening at', config['listen_addr'])
  }
);

process.on('SIGINT', function() {
  responder.close();
});


function dispatchRequest(rqt, callback) {
  try {
    var rqt_json = JSON.parse(rqt.toString());
  }
  catch(err) {
    return callback(
      {
        'rqt': rqt,
        'res': {
          status: 'error',
          data: err.toString()
        }
      }
    );
  }

  var ret = { 'rqt': rqt_json };

  if(!('uri' in rqt_json)) {
    ret['res'] = {
      status: 'error',
      data: 'Missing URI'
    };
    return callback(ret);
  }

  var route = getRoute(routing_table, rqt_json['uri']);
  if(route['status'] != 'ok') {
    ret['res'] = {
      status: 'error',
      data: route['data'] + ': ' + rqt_json['uri']
    };
    return callback(ret);
  }
  route['data']['route'](
    rqt_json,
    route['data']['vars'],
    function(res) {
      ret['res'] = res;
      callback(ret);
    }
  );
}

// TODO: Do not reinvent the wheel, use express.Router.
// https://expressjs.com/en/4x/api.html#router
function getRoute(routing_table, uri) {
  uri = uri.replace(/^\/|\/$/g, '');
  var path = uri.split('/');
  return route_path(routing_table, path);

  function route_path(routing_table, path) {
    if(path.length == 0) {
      return {
        status: 'ok',
        data: {
          route: routing_table,
          vars: { }
        }
      };
    }

    var variable = undefined;
    var keys = Object.keys(routing_table);
    if(keys.length == 1 && keys[0].length > 0 && keys[0].charAt(0) == ':') {
      element = keys[0];
      variable = {
        name: keys[0].substring(1),
        value: path.shift()
      }
    }
    else {
      console.log(path);
      var element = path.shift();
      if(element === '') {
        element = '/'
      }
      if(!(element in routing_table)) {
        return {
          status: 'error',
          data: 'Unknown URI'
        };
      }
    }

    var result = route_path(routing_table[element], path);
    if(variable !== undefined && !(variable['name'] in result['data']['vars'])) {
      result['data']['vars'][variable['name']] = variable['value'];
    }
    return result;
  }
}


var routing_table = {
  '/': handleIndex,
  'next': handleNext,
  'item': {
    ':id': handleItem
  }
}

function handleIndex(rqt, vars, callback)
{
  if(!('method' in rqt)) {
    return callback({
      status: 'error',
      data: 'Missing method'
    });
  }
  if(rqt['method'] != 'GET') {
    return callback({
      status: 'error',
      data: 'Method not supported for this URI: ' + rqt['method']
    });
  }

  callback({
    status: 'ok',
    data: {
      'version': VERSION,
      'actions': [
        {
          'href': '/',
          'rel': 'index',
          'method': 'GET'
        },
        {
          'href': '/next',
          'rel': 'next',
          'method': 'GET'
        },
        {
          'href': '/item/:id',
          'rel': 'item',
          'method': 'DELETE'
        }
      ]
    }
  });
}

function handleNext(rqt, vars, callback)
{
  if(!('method' in rqt)) {
    return callback({
      status: 'error',
      data: 'Missing method'
    });
  }
  if(rqt['method'] != 'GET') {
    return callback({
      status: 'error',
      data: 'Method not supported for this URI: ' + rqt['method']
    });
  }

  async.waterfall(
    [
      function(async_callback) {
        mongoClient.connect(
          config['mongo_db_uri'],
          async_callback
        )
      },
      function(db, async_callback) {
        db.collection('documents').findAndModify(
          { state: 'ready' }, // query
          { }, // sort
          { $set: { state: 'processing' } }, // update
          { }, // options
          async_callback // async_callback
        );
      },
      function(res, async_callback) {
        var obj = res['value'];
        if(obj === null) {
          return async_callback(null, null);
        }
        try {
          async_callback(
            null,
            {
              id: res['value']['_id'],
              data: Buffer(fs.readFileSync(path.join(
                DATA_DIR,
                obj['data_dir'],
                obj['data_file']
              ))).toString('base64'),
              metadata: obj['metadata']
            }
          );
        }
        catch(err) {
          async_callback(err, null);
        }
      }
    ],
    function(err, data) {
      if(err) {
        callback({
          status: 'error',
          data: err.toString()
        });
      }
      else {
        callback({
          status: 'ok',
          data: data
        });
      }
    }
  );
}

function handleItem(rqt, vars, callback)
{
  if(!('method' in rqt)) {
    return callback({
      status: 'error',
      data: 'Missing method'
    });
  }
  var new_state = {
    DELETE: 'processed',
    POST: 'ready'
  };
  if(!(rqt['method'] in new_state)) {
    return callback({
      status: 'error',
      data: 'Method not supported for this URI: ' + rqt['method']
    });
  }

  async.waterfall(
    [
      function(async_callback) {
        mongoClient.connect(
          config['mongo_db_uri'],
          async_callback
        )
      },
      function(db, async_callback) {
        var id = new mongodb.ObjectID(vars['id']);
        db.collection('documents').findAndModify(
          { _id: id, state: 'processing' }, // query
          { }, // sort
          { $set: { state: new_state[rqt['method']] } }, // update
          { }, // options
          async_callback // async_callback
        );
      },
      function(res, async_callback) {
        console.log('result:', res);
        var obj = res['value'];
        if(obj === null) {
          return async_callback(
            'There is no document with given ID being processed: ' + vars['id'],
            null
          );
        }
        async_callback(
          null,
          {
            id: res['value']['_id'],
          }
        );
      }
    ],
    function(err, data) {
      if(err) {
        callback({
          status: 'error',
          data: err.toString()
        });
      }
      else {
        callback({
          status: 'ok',
          data: data
        });
      }
    }
  );
}


// vim: set ts=2 sw=2 et:


