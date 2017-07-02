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
var tmpDir =   path.join(__dirname, "/tmp"); //os.platform


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
        });

    }
    catch(err) {
        console.log(err);
    }

});


$('#parametrage').submit(function(ev) {
    ev.preventDefault(); // to stop the form from submitting
    /* Validations go here */

    account.CreateAccount($("#password").val(), $("#token").val(), $("#compte").val(), $("#rep").val());
    //ipcRenderer.sendSync('parametrage', account);

});


$("#save").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        upload.upload(paramAccount);
    });

});

$("#load-apercus").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        download.download(paramAccount, tmpDir);
        dialog.showOpenDialog({defaultPath: tmpDir});
    });

});

$("#restore").click(function(ev) {
    ev.preventDefault();
    account.getAccount((paramAccount) => {
        download.replace(paramAccount, tmpDir);
    });
});