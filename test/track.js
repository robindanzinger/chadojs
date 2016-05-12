'use strict';

var path = require('path');
var expect = require('must');
var track = require('../lib/track').track;
var setCurrentTest = require('../lib/track').setCurrentTest;

describe('library track', function () {
  it('given a called function, it returns file-information about the caller', function foo() {
    function func() {
      var trackInfo = track();
      expect(trackInfo.file).to.be(path.join(__dirname, 'track.js'));
      expect(trackInfo.test).to.be('Context.foo');
      expect(trackInfo.line).to.eql('18');
      expect(trackInfo.index).to.eql('5');
    }

    func();
  });

  it('track the testname if set', function () {
    setCurrentTest('myTest');
    var trackInfo = track();
    expect(trackInfo.test).to.be('myTest');
  });
});
