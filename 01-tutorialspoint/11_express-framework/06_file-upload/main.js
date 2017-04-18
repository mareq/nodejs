#!/usr/bin/env node

// https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm


var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: './tmp/'}).single('file'));

app.get(
  '/index.htm',
   function(req, res) {
     res.sendFile( __dirname + "/" + "index.htm" );
  }
)

app.post(
  '/file_upload',
  function(req, res) {
    if(req.file) {
      console.log(req.file.originalname);
      console.log(req.file.path);

      var file = __dirname + "/uploads/" + req.file.originalname;
      fs.readFile(
        req.file.path,
        function(err, data) {
          fs.writeFile(
            file,
            data,
            function(err) {
              if(err) {
                console.log(err);
              }
              else {
                response = {
                  message:'File uploaded successfully',
                  filename:req.file.originalname
                };
              }
              console.log(response);
              res.end(JSON.stringify(response));
            }
          );
        }
      );
    }
    else {
      response = {
        message:'File upload error'
      };
      res.end(JSON.stringify(response));
    }
  }
)

var server = app.listen(
  8081,
  function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
  }
)


