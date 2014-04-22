'use strict';

var createFile = require('../index');
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
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = createFile({
      content: content,
      destFile: '/something.js'
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      expect(fs.readFileSync(dir + '/something.js', {encoding: 'utf8'})).to.eql(content);
    });
  })
});
