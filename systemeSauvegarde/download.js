#!/usr/bin/env nodejs

// DOWNLOAD ET DECRYPT

var chokidar = require('chokidar');
var http = require('http');
var fs = require('fs');
var zlib = require('zlib');
var dbox  = require("dbox");
var dropbox = require('dropbox-v2-api');
var express = require('express');
var app = express();
const path = require('path');
var Client = require('node-rest-client').Client;
var crypto = require('crypto');
algorithm = 'aes-256-ctr';
var file = [];
var count = "";


var client = new Client();

exports.download = function(account, tmpDir, onFinished, dossierDestination)  {
  var token = account.token;
  var password = account.password;
  var name = account.compte;
  console.log(name);
  var dir = tmpDir+"/";


  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');


  }).listen(3000);
  console.log('Server running at http://localhost:3000/');

  var dropboxDownload = function()
  {

    client.get("https://fabiendhermy.fr/SaveYourLife/webservice/index.php/auth/"+name, function (data, response) {
      var res = JSON.parse(data.toString());
      console.log(res[0].token);

      //token = res[0].token;
      //password = res[0].cle;
    });

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
          .pipe(fs.createWriteStream(dir+response.entries[i].name));

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

    //console.log("test");
    console.log(tmpDir+"/"+pathFile);
    // input file
    var r = fs.createReadStream(tmpDir+"/"+pathFile);

    // zip content
    var zip = zlib.createGzip();

    // encrypt content
    var encrypt = crypto.createCipher(algorithm, password);
    console.log(password);
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
      //fs.unlinkSync(tmpDir+file[file.length-1]);
      file.pop();
      if (file.length != 0) {
        decryptFile(file[file.length-1]);
      }
      else {
        console.log('finish');
          onFinished();
      }
    });
    //console.log('nom du fichier: '+ path.basename(pathFile));

  }
  dropboxDownload();
}

//ToDO : chokidar.close() le temps de faire le replace ???
exports.replace = function(account, tmpDir) {
    var rep =  account.rep;



}


//decryptFile('/home/fabien/Documents/SaveYourLife/systemeSauvegarde/test.odt');
