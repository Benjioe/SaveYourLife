const ignore = require('ignore');
const ignoreFile = '/.lifeignore';
const fs = require('fs');

function filter(listPath) {
  return ignore()
  .add(fs.readFileSync(filenameOfGitignore).toString())
  .filter(listPath);
}


function getIgnoreFilePath() {
  return ignoreFile;
}


exports.filter = filter;
exports.getIgnoreFilePath = getIgnoreFilePath;
