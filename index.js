const fs = require('fs');

var listDirectoryPath = ['D:\Benja\Documents\GitHub\SaveYourLife\Test']

function initHandlerDirectory() {
    listDirectoryPath.forEach(function(element) {
         fs.watch(element, function (event, filename) {
            if (filename) {
                console.log('filename provided: ' + filename);
            } else {
                console.log('filename not provided');
            }
        });       
    }, this);
}