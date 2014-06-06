var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var quickTemp = require('quick-temp');

Creator.prototype.constructor = Creator;
function Creator (filename, content, options) {
  if (!(this instanceof Creator)) return new Creator(filename, content, options);

  this.content   = content;
  this.filename  = filename;
  this.fileOptions = options || { encoding: 'utf8' };
  this.cacheFile();
};

Creator.prototype.cacheFile = function () {
  quickTemp.makeOrReuse(this, 'tmpSrcDir');
  var filename = path.join(this.tmpSrcDir, this.filename);
  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, this.content, this.fileOptions);
};

Creator.prototype.read = function () {
  return this.tmpSrcDir;
};

Creator.prototype.cleanup = function () {
  quickTemp.remove(this, 'tmpSrcDir');
}

module.exports = Creator;
