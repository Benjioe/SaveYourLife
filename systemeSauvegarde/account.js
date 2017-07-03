const fs = require('fs');
const pathAccount = './account.json';

const {ipcMain} = require('electron');


var account;

function initAccount(handler) {
    if(fs.existsSync(pathAccount))
    {
        fs.readFile(pathAccount, (err, data) => {
            if(err) {
                throw err;
            }

            handler(JSON.parse(data));
        })
    }
}



exports.getAccount = function(handler) {
    if(!account)
        initAccount((data) => {
            if(!data)
                throw "Il faut créer un compte";
            else
                account = data;

            handler(account);
        });
    else
        handler(account);
}

exports.CreateAccount = function (password,token, compte, rep, tmpRep) {
//password = 'd6F3Efeq', // METTTRE EN INTERFACE

    if(!password)
      throw "Il manque le password";

    if(!token)
      token = 'XhKUuTYv0qAAAAAAAAAAD1jlocOTS4YOgOVgtnm3NdSJDhnxm2tmsyyVzY2K22ie'; // METTTRE EN INTERFACE

    if(!compte)
      compte = "Fabien"; // METTTRE EN INTERFACE

    if(!rep)
        rep = "/home/fabien/Documents/SaveYourLife/systemeSauvegarde/";


    account =  {
        password: password,
        token: token,
        compte: compte,
        rep:rep,
        destinationDir: tmpRep
    }

    fs.writeFile(pathAccount, JSON.stringify(account), (err) => {
        if (err) throw err;
        console.log('account saved');
    });

    return account;


}
