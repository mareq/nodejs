#!/usr/bin/env node

var Promise = require('promise');
var path = require('path');
var fs = require('fs');
var zmq = require('zmq');


VERSION = '0.1';
CONFIG_FILE = path.join(__dirname, 'etc', 'indexer.conf.json');


var config = JSON.parse(
  fs.readFileSync(CONFIG_FILE).toString()
);


console.log('Connecting to raw-storage');
var requester = zmq.socket('req');
requester.connect(config['raw_storage_address']);

var outstanding_rqts = {
  counter: 0,
  rqts: { }
};
var has_next = true;
requestNext();

requester.on(
  'message',
  function(res) {
    try {
      var res_json = JSON.parse(res.toString());
    }
    catch(err) {
      console.error('Invalid response:', err.toString());
      return;
    }

    dispatchResponse(res_json);
  }
);

process.on('SIGINT', function() {
  requester.close();
});


function generateRqtId() {
  if(
    Object.keys(outstanding_rqts.rqts).length
    >
    config['raw_storage_rqt_queue_size']
  ) {
    console.error('too many outstanding requests');
    return -1;
  }

  while(++outstanding_rqts.counter in outstanding_rqts.rqts)
    ;
  return outstanding_rqts.counter;
}

function sendRequest(rqt, res_handler) {
  var rqt_id = generateRqtId();
  if(rqt_id < 0) {
    setTimeout(sendRequest(rqt, res_handler), 1000);
    return;
  }
  rqt['rqt_id'] = rqt_id;

  console.log('Sending request:', rqt);
  requester.send(JSON.stringify(rqt));
  outstanding_rqts.rqts[rqt_id] = {
    'rqt': rqt,
    'res_handler': res_handler
  };
}

function dispatchResponse(res) {
  var rqt_id = res['rqt_id'];
  if(!(rqt_id in outstanding_rqts.rqts)) {
    console.error('Unexpected response:', res);
  }

  var rqt = outstanding_rqts.rqts[rqt_id];
  delete outstanding_rqts.rqts[rqt_id];
  rqt['res_handler'](rqt['rqt'], res);
}

function requestNext()
{
  sendRequest({ uri: '/next', method: 'GET' }, processNext);
}

var raw_storage_err_cnt
function processNext(rqt, res)
{
  console.log(
    'Received response:',
    {
      rqt: rqt,
      res: res
    }
  );

  if(res['status'] == 'ok' && res['data'] == null) {
    console.log('done');
    process.exit(0);
  }

  if(res['status'] == 'err') {
    if(++raw_storage_err_cnt >= config['raw_storage_max_errors']) {
      console.error(
        'maximum number of errors reached, bailing out:',
        raw_storage_err_cnt
      );
      process.exit(1);
    }
  }
  raw_storage_err_cnt = 0;

  var item_id = res['data']['id'];
  processItem(res['data'])
    .then(function(success) {
      requestFinish(item_id, success);
    })
  ;

  // TODO: come up with better way of scheduling request for next item to process
  setImmediate(requestNext());
}

function requestFinish(item_id, success)
{
  sendRequest(
    {
      uri: '/item/' + item_id,
      method: (success ? 'DELETE' : 'POST')
    },
    processFinish
  );
}

function processFinish(rqt, res)
{
  console.log(
    'Received response:',
    {
      rqt: rqt,
      res: res
    }
  );
}


function processItem(item)
{
  return Promise.resolve(false);
}


// vim: set ts=2 sw=2 et:


