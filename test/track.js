'use strict';

var expect = require('must');
var track = require('../lib/track').track;
var setCurrentTest = require('../lib/track').setCurrentTest;

describe('library track', function () {
  it('given a called function, it returns file-information about the caller', function foo () {
    var func = function () {
      var trackInfo = track();
      expect(trackInfo.file).to.match('.*track.js');
      expect(trackInfo.test).to.be('Context.foo');
      expect(trackInfo.line).to.eql('16');
      expect(trackInfo.index).to.eql('5');
    };
    func();
  });
  it('track the testname if set', function () {
    setCurrentTest('myTest');
    var trackInfo = track();
    expect(trackInfo.test).to.be('myTest');
  });
});
