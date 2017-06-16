#!/usr/bin/env nodejs
var chokidar = require('chokidar');
var http = require('http');
var fs = require('fs');
var zlib = require('zlib');
var dbox  = require("dbox");
var dropbox = require('dropbox-v2-api');
var express = require('express');
var app = express();
const path = require('path');
var crypto = require('crypto'),

exports.download = download;


function download(password, token) {
  algorithm = 'aes-256-ctr';

  if(!password)
    password = 'd6F3Efeq';

    if(!token)
      token = 'XhKUuTYv0qAAAAAAAAAAD1jlocOTS4YOgOVgtnm3NdSJDhnxm2tmsyyVzY2K22ie';

  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');


  }).listen(3000);
  console.log('Server running at http://localhost:3000/');

  var dropboxDownload = function()
  {
    dropbox.authenticate({
      token: token
    });

    /*dropbox({
        resource: 'files/download',
        parameters: {
            path: '/dropbox/path/test/'
        }
    }, (err, result) => {
      console.log(result);
    })
    .pipe(fs.createWriteStream('voila.odt'));*/
    dropbox({
        resource: 'files/list_folder',
        parameters: {
            path: '/dropbox/path/test'
        }
    }, (err, response) => {
        if (err) { return console.log('err:', err); }

        for (var i = 0; i < response.entries.length; i++) {
          console.log(response.entries[i].name);

          dropbox({
              resource: 'files/download',
              parameters: {
                  path: '/dropbox/path/test/'+response.entries[i].name
              }
          }, (err, result) => {
            console.log(result);
          })
          .pipe(fs.createWriteStream(response.entries[i].name));
        }
    });

  }

  var decryptFile = function(pathFile) {

  console.log("test");
    // input file
    var r = fs.createReadStream(pathFile);

    // zip content
    var zip = zlib.createGzip();

    // encrypt content
    var encrypt = crypto.createCipher(algorithm, password);

    // decrypt content
    var decrypt = crypto.createDecipher(algorithm, password)

    // unzip content
    var unzip = zlib.createUnzip();

    // write file
    var w = fs.createWriteStream('result.odt');

    //var chown = fs.chown('test.txt', 1000, 1000, console.log);
    // start pipe
    var stream = r.pipe(decrypt).pipe(unzip).pipe(w);

    stream.on('finish', function(){
      console.log('finish');
    });
    //console.log('nom du fichier: '+ path.basename(pathFile));

  }
  dropboxDownload();
  //decryptFile('/home/fabien/Documents/systemeSauvegarde/test.odt');
}
