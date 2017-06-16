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
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';
var file = [];
var count = "";
var dir = './temp';

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');


}).listen(3000);
console.log('Server running at http://localhost:3000/');

var dropboxDownload = function()
{
  dropbox.authenticate({
    token: 'XhKUuTYv0qAAAAAAAAAAD1jlocOTS4YOgOVgtnm3NdSJDhnxm2tmsyyVzY2K22ie'
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

      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
          fs.chown(dir, 1000, 1000, console.log('right'));
      }

      for (var i = 0; i < response.entries.length; i++) {
        console.log(response.entries[i].name);
        count = response.entries.length;

        var stream = dropbox({
            resource: 'files/download',
            parameters: {
                path: '/dropbox/path/test/'+response.entries[i].name
            }
        }, (err, result) => {
          console.log(result);
          file.push(result.name);
        })
        .pipe(fs.createWriteStream("temp/"+response.entries[i].name));

        stream.on('finish', function(){
          console.log('finishWrite');
          if (count == file.length) {
            decryptFile(file[file.length-1]);
          }
        });
      }
  });

}

var decryptFile = function(pathFile) {

  console.log("test");
  console.log(pathFile);
  // input file
  var r = fs.createReadStream("temp/"+pathFile);

  // zip content
  var zip = zlib.createGzip();

  // encrypt content
  var encrypt = crypto.createCipher(algorithm, password);

  // decrypt content
  var decrypt = crypto.createDecipher(algorithm, password)

  // unzip content
  var unzip = zlib.createUnzip();

  // write file
  var w = fs.createWriteStream(pathFile);

  //var chown = fs.chown('test.txt', 1000, 1000, console.log);
  // start pipe
  var stream = r.pipe(decrypt).pipe(unzip).pipe(w);

  stream.on('finish', function(){
    file.pop();
    if (file.length != 0) {
      decryptFile(file[file.length-1]);
    }
    else {
      console.log('finish');

    }
  });
  //console.log('nom du fichier: '+ path.basename(pathFile));

}
dropboxDownload();
//decryptFile('/home/fabien/Documents/SaveYourLife/systemeSauvegarde/test.odt');
