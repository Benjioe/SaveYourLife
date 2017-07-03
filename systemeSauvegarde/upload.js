#!/usr/bin/env nodejs

// POUR L'UPLOAD

var chokidar = require('chokidar');
var http = require('http');
var fs = require('fs');
var zlib = require('zlib');
var dbox  = require("dbox");
var dropbox = require('dropbox-v2-api');
var express = require('express');
var Client = require('node-rest-client').Client;
var app = express();
const path = require('path');
var crypto = require('crypto'),
algorithm = 'aes-256-ctr';
const {ipcMain} = require('electron');



const ignore = require('ignore');
const ignoreFile = path.join(__dirname, '../.lifeignore');

//chokidar.unwatch([])
function filter(listPath) {
    return ignore()
        .add(fs.readFileSync(ignoreFile).toString())
        .filter(listPath).length > 0;
}

//var token = '2UAT4hioqL58uTZK';
//var token_secret = 'WHsuxVI4OHw2qmwO';
//var app   = dbox.app({ "app_key": "yrtf1tqgccswdpj", "app_secret": "sn9g5gglxw1pplq" });

//var dropbox = new DropboxClient('yrtf1tqgccswdpj', 'sn9g5gglxw1pplq');

exports.upload = function(account, onALlFileUplozd) {

  console.log("upload");

    var password = account.password,
        token = account.token,
        compte = account.compte,
        rep = account.rep;

  var client = new Client();


  var args = {
      data: { cle: password, id_client: compte, token: token},
      headers: { "Content-Type": "application/json" }
  };

  client.post("https://fabiendhermy.fr/SaveYourLife/webservice/index.php/auth", args, function (data, response) {
      // parsed response body as js object
      //console.log(data);
      // raw response
      console.log(response);
  });

  var nbFileTraite = 0;
  function onFIleFinishe() {
      nbFileTraite--;
      if(nbFileTraite <= 0)
          onALlFileUplozd();
  }


  // One-liner for current directory, ignores .dotfiles
  chokidar.watch(rep, {ignored: /(^|[\/\\])\../}).on('add', (event, path) => {
    console.log(event);


      nbFileTraite++;
    encryptFile(event, onFIleFinishe);
  });

  chokidar.watch(rep, {ignored: /(^|[\/\\])\../}).on('change', (event, path) => {
    console.log(event, path);
      nbFileTraite++;
    encryptFile(event,onFIleFinishe);
  });

  var encryptFile = function(pathFile, onFileFinished) {

    if(!filter(pathFile)) {
      console.log("Ignore file : " + pathFile);
      return;
    }
    // input file
    var r = fs.createReadStream(pathFile);

    // zip content
    var zip = zlib.createGzip();

    // encrypt content
    var encrypt = crypto.createCipher(algorithm, password);

    // decrypt content
    var decrypt = crypto.createDecipher(algorithm, password)

    // unzip content
    var unzip = zlib.createGunzip();

    var options = { flags: 'w' };
    // write file
    var w = fs.createWriteStream(path.basename(pathFile));

    //var chown = fs.chown('test.txt', 1000, 1000, console.log);
    // start pipe
    var stream = r.pipe(zip).pipe(encrypt).pipe(w);

    //console.log('nom du fichier: '+ path.basename(pathFile));

    stream.on('finish', function(){
      //fs.chown('test.txt', 1000, 1000, console.log('fabien'));
      dropbox.authenticate({
        token: token
      });


      const dropboxUploadStream = dropbox({
        resource: 'files/upload',
        parameters: {
          path: '/dropbox/path/test/'+path.basename(pathFile)
        }
      }, (err, result) => {
        console.log(result);
        fs.unlinkSync(rep +result.name);
        onFileFinished();
      });

      fs.createReadStream(rep +path.basename(pathFile)).pipe(dropboxUploadStream);

    });



  }
}

/*
var watcher = chokidar.watch('file, dir, glob, or array', {
ignored: /(^|[\/\\])\../,
persistent: true
});
watcher
.on('add', path => console.log(`File ${path} has been added`))
.on('change', path => console.log(`File ${path} has been changed`))
*/
