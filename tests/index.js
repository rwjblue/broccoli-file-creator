'use strict';

var writeFile = require('../index');
var expect = require('expect.js');
var sinon = require('sinon');

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-file-creator', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('creates the file specified at the correct path', function(){
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = writeFile('/somewhere/something.js', content);

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      expect(fs.readFileSync(dir + '/somewhere/something.js', {encoding: 'utf8'})).to.eql(content);
    });
  })

  it('writes the file only once', function(){
    var spy = sinon.spy(fs, "writeFileSync");
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = writeFile('/something.js', content);
    expect(spy.callCount).to.eql(1);

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      return builder.build().then(function(dir) {
        expect(fs.readFileSync(dir + '/something.js', {encoding: 'utf8'})).to.eql(content);
        expect(spy.callCount).to.eql(1);
        fs.writeFileSync.restore();
      });
    });
  });
});
