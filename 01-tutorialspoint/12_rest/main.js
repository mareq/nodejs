#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_streams.htm


var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.get(
  '/users',
  function(req, res) {
    fs.readFile(
      __dirname + "/" + "users.json",
      'utf8',
      function(err, data) {
        console.log(data);
        res.end(data);
      }
    );
  }
);

app.get(
  '/users/:id',
  function(req, res) {
    // First read existing users.
    fs.readFile(
      __dirname + "/" + "users.json",
      'utf8',
      function(err, data) {
        users = JSON.parse(data);
        var user = users["user" + req.params.id] 
        console.log(user);
        res.end(JSON.stringify(user));
      }
    );
  }
);

app.post(
  '/users',
   urlencodedParser,
   function (req, res) {
     var user = JSON.parse(req.body.user);
     // First read existing users.
     fs.readFile(
       __dirname + "/" + "users.json",
       'utf8',
       function(err, data) {
         data = JSON.parse(data);
         data["user4"] = user["user4"];
         console.log(data);
         res.end(JSON.stringify(data));
       }
     );
  }
);

app.delete(
  '/users/:id',
  function(req, res) {
    // First read existing users.
    fs.readFile(
      __dirname + "/" + "users.json",
      'utf8',
      function(err, data) {
        data = JSON.parse( data );
        delete data["user" + id];

        console.log( data );
        res.end(JSON.stringify(data));
      }
    );
  }
);

var server = app.listen(
  8081,
  function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
  }
);


