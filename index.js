var fs = require('fs');
var path = require('path');
var Plugin = require('broccoli-plugin');
var RSVP = require('rsvp');
var symlinkOrCopySync = require('symlink-or-copy').sync;
var mkdirp = require('mkdirp');

module.exports = Creator;
Creator.prototype = Object.create(Plugin.prototype);
Creator.prototype.constructor = Creator;

function Creator (filename, content, _options) {
  var options = _options || {
    encoding: 'utf8'
  };

  if (!(this instanceof Creator)) {
    return new Creator(filename, content, options);
  }

  Plugin.call(this, [/* no inputTrees */], {
    annotation: options.annotation || this.constructor.name + ' ' + filename,
    persistentOutput: true
  });

  delete options.annotation;

  this.content = content;
  this.filename = filename;
  this.fileOptions = options;
}

Creator.prototype.getContent = function() {
  var plugin = this;

  return new RSVP.Promise(function(resolve) {
    resolve(plugin.content);
  });
}

Creator.prototype.build = function () {
  var outputFilePath = path.join(this.outputPath, this.filename);
  var plugin = this;

  if (fs.existsSync(outputFilePath)) {
    return;
  }

  mkdirp.sync(path.dirname(outputFilePath));

  return new RSVP.Promise(function(resolve) {
    resolve(plugin.getContent());
  }).then(function(content) {
    fs.writeFileSync(outputFilePath, content, plugin.fileOptions);
  });
};
