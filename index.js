var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Writer = require('broccoli-writer');
var Promise = require('rsvp').Promise

Creator.prototype = Object.create(Writer.prototype);
Creator.prototype.constructor = Creator;
function Creator (filename, content, options) {
  if (!(this instanceof Creator)) return new Creator(filename, content, options);

  this.content   = content;
  this.filename  = filename;
  this.fileOptions = options || { encoding: 'utf8' };
};

Creator.prototype.write = function (readTree, destDir) {
  var _this = this

  return Promise.resolve().then(function() {
    var fileName = path.join(destDir, _this.filename);
    mkdirp.sync(path.dirname(fileName));
    fs.writeFileSync(fileName, _this.content, _this.fileOptions);
  });
};

module.exports = Creator;
