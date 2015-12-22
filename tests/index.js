'use strict';

var writeFile = require('../index');
var chai = require('chai');
var expect = chai.expect;
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

chai.Assertion.addMethod('sameStatAs', function(otherStat) {
  this.assert(
    this._obj.mode === otherStat.mode,
    'expected mode ' + this._obj.mode + ' to be same as ' + otherStat.mode,
    'expected mode ' + this._obj.mode + ' to not the same as ' + otherStat.mode
  );

  this.assert(
    this._obj.size === otherStat.size,
    'expected size ' + this._obj.size + ' to be same as ' + otherStat.size,
    'expected size ' + this._obj.size + ' to not the same as ' + otherStat.size
  );

  this.assert(
    this._obj.mtime.getTime() === otherStat.mtime.getTime(),
    'expected mtime ' + this._obj.mtime.getTime() + ' to be same as ' + otherStat.mtime.getTime(),
    'expected mtime ' + this._obj.mtime.getTime() + ' to not the same as ' + otherStat.mtime.getTime()
  );
});

describe('broccoli-file-creator', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  function read(path) {
    return fs.readFileSync(path, 'UTF8');
  }
  it('creates the file specified', function(){
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = writeFile('/something.js', content);

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(result) {
      expect(read(result.directory + '/something.js')).to.eql(content);
    });
  });

  it('creates the file specified in a non-existent directory', function(){
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = writeFile('/somewhere/something.js', content);

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(result) {
      expect(read(result.directory + '/somewhere/something.js')).to.eql(content);
    });
  });

  it('correctly caches', function(){
    var content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    var tree = writeFile('/something.js', content);

    builder = new broccoli.Builder(tree);

    var stat;

    return builder.build().then(function(result) {
      stat = fs.lstatSync(result.directory + '/something.js');
      return builder.build();
    }).then(function(result){
      var newStat = fs.lstatSync(result.directory + '/something.js');

      expect(newStat).to.be.sameStatAs(stat);
    });
  });
});
