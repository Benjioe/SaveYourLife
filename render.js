/**
 * Created by benja on 02/07/2017.
 */

const {dialog} = require('electron').remote;
const account = require('./systemeSauvegarde/account');

const upload = require("./systemeSauvegarde/upload");
const download = require("./systemeSauvegarde/download");

var shell = require('electron').shell;
var path = require('path')

var paramAccount;
var tmpDir =  function() {
    return path.join(__dirname, "/tmp");
}

var dossierDestination = function() {
    return $("#rep-tmp").val();
}

var delimitatorFilePath = process.platform == "win32" ? "\\" : "/";


function OpenIgnoreFile() {
    var fileIgnore = path.join(__dirname, '.lifeignore');
    shell.openExternal('file://' + fileIgnore);
}

$(document).ready(function(){
    try {
        account.getAccount((acc) => {
            $("#password").val(acc.password);
            $("#token").val(acc.token);
            $("#compte").val(acc.compte);
            $("#rep").val(acc.rep);
            $("#rep-tmp").val(acc.destinationDir);
        });

    }
    catch(err) {
        console.log(err);
    }

});

$("#select-directory").click(function() {
    dialog.showOpenDialog({properties: ['openDirectory']}, (filePath) => {
        var filePathFormat = filePath;

        if(filePathFormat.slice(-1) != delimitatorFilePath)
            filePathFormat += delimitatorFilePath;
        $("#rep").val(filePathFormat);
    });

});


$("#select-directory-tmp").click(function() {
    dialog.showOpenDialog({properties: ['openDirectory']}, (filePath) => {
        var filePathFormat = filePath;

        if(filePathFormat.slice(-1) != delimitatorFilePath)
            filePathFormat += delimitatorFilePath;
        $("#rep-tmp").val(filePathFormat);
    });

});

$('#parametrage').submit(function(ev) {
    ev.preventDefault(); // to stop the form from submitting
    /* Validations go here */

    account.CreateAccount($("#password").val(), $("#token").val(), $("#compte").val(), $("#rep").val(), dossierDestination());
    //ipcRenderer.sendSync('parametrage', account);

});


$("#save").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        upload.upload(paramAccount, () => {alert('File upload'); });
    });

});

$("#load-apercus").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        download.download(paramAccount, tmpDir(), () => {
            dialog.showOpenDialog({defaultPath: dossierDestination()});
        }, dossierDestination());
    });

});

$("#restore").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        download.download(paramAccount, tmpDir(), () => {
        }, dossierDestination());
    });
});