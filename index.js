var fs = require('fs');
var path = require('path');
var Plugin = require('broccoli-plugin');
var symlinkOrCopySync = require('symlink-or-copy').sync;
var mkdirp = require('mkdirp');

module.exports = Creator;
Creator.prototype = Object.create(Plugin.prototype);
Creator.prototype.constructor = Creator;

function Creator (filename, content, _options) {
  var options = _options || { encoding: 'utf8' };
  if (!(this instanceof Creator)) return new Creator(filename, content, _options);

  Plugin.call(this, [/* no inputTrees */], {
    annotation: options.annotation || this.constructor.name + ' ' + filename
  });

  delete options.annotation;

  this.content = content;
  this.filename = filename;
  this.fileOptions = options;
};

Creator.prototype.build = function () {
  var cacheFilePath = path.join(this.cachePath, this.filename);
  var outputFilePath = path.join(this.outputPath, this.filename);

  writeToCache(cacheFilePath, this.content, this.fileOptions);
  linkFromCache(cacheFilePath, outputFilePath);
};

function writeToCache(cacheFilePath, content, options) {
  if (fs.existsSync(cacheFilePath)) { return; }
  mkdirp.sync(path.dirname(cacheFilePath));
  fs.writeFileSync(cacheFilePath, content, options);
}

function linkFromCache(from, to) {
  mkdirp.sync(path.dirname(to));

  symlinkOrCopySync(from, to);
}
