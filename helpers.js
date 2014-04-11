var fs = require('fs');
var path = require('path');

global.getExtension = function (filename) {
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
};