'use strict';

const writeFile = require('../index');
const chai = require('chai');
const expect = chai.expect;
const rimraf = require('rimraf');
const root = process.cwd();

const fs = require('fs');
const broccoli = require('broccoli');

let builder;

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

describe('broccoli-file-creator', function() {
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  function read(path) {
    return fs.readFileSync(path, 'UTF8');
  }

  it('creates the file specified', function() {
    const content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    const tree = writeFile('/something.js', content);

    builder = new broccoli.Builder(tree);

    return builder.build().then(result => {
      expect(read(result.directory + '/something.js')).to.eql(content);
    });
  });

  it('creates the file specified in a non-existent directory', function() {
    const content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    const tree = writeFile('/somewhere/something.js', content);

    builder = new broccoli.Builder(tree);

    return builder.build().then(result => {
      expect(read(result.directory + '/somewhere/something.js')).to.eql(content);
    });
  });

  it('if the content is a function, that functions return value or fulfillment value is used', function() {
    const CONTENT = 'ZOMG, ZOMG, HOLY MOLY!!!';
    const tree = writeFile('the-file.txt', () => Promise.resolve(CONTENT));

    builder = new broccoli.Builder(tree);

    return builder.build().then(result => {
      expect(read(result.directory + '/the-file.txt')).to.eql(CONTENT);
    });
  });

  it('correctly caches', function() {
    const content = 'ZOMG, ZOMG, HOLY MOLY!!!';
    const tree = writeFile('/something.js', content);

    builder = new broccoli.Builder(tree);

    var stat;

    return builder.build().then(result =>  {
      stat = fs.lstatSync(result.directory + '/something.js');
      return builder.build();
    }).then(result => {
      var newStat = fs.lstatSync(result.directory + '/something.js');

      expect(newStat).to.be.sameStatAs(stat);
    });
  });
});
