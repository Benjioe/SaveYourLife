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
var count = 0;

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

  for (var i = 0; i < response.entries.length; i++) {
    console.log(response.entries[i].name);
    count = response.entries.length;

    var f = fs.createWriteStream(response.entries[i].name);

    f.on('finish', function() {
      // do stuff
      console.log(file);
      console.log('testFIn');
      if (count == file.length) {
        decryptFile(file[0]);
      }
    });

    dropbox({
      resource: 'files/download',
      parameters: {
        path: '/dropbox/path/test/'+response.entries[i].name
      }
    }, (err, result) => {
      file.push(result.name);

    }).pipe(f);

    //.pipe(fs.createWriteStream(response.entries[i].name)).pipe(decryptFile(response.entries[i].name));

  }
  console.log("test2");
});

}

var decryptFile = function(pathFile) {

  console.log("test");

    console.log(pathFile);

    // input file
    var r = fs.createReadStream('/home/fabien/Documents/SaveYourLife/systemeSauvegarde/'+pathFile);

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
      console.log('finish');
    });
    //console.log('nom du fichier: '+ path.basename(pathFile));

}
dropboxDownload();
//decryptFile('/home/fabien/Documents/systemeSauvegarde/test.odt');
