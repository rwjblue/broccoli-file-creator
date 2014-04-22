'use strict';

var moveFile = require('../index');
var expect = require('expect.js');
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-file-creator', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('creates the file specified', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = moveFile(sourcePath, {
      srcFile: '/lib/main.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
    });
  })

  describe('accepts an array of objects as the `files` option', function() {
    it('deletes all files provided', function(){
      var sourcePath = 'tests/fixtures/sample-ember-style-package';
      var tree = moveFile(sourcePath, {
        files: [ '/lib/main.js', '/lib/core.js']
      });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(dir) {
        expect(fs.existsSync(dir + '/lib/main.js')).to.not.be.ok();
        expect(fs.existsSync(dir + '/lib/core.js')).to.not.be.ok();
      });
    })
  });
});
