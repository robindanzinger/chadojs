'use strict';

var expect = require('must');
var track = require('../lib/track').track;

describe('library track', function () {
  it('given a called function, it returns file-information about the caller', function foo () {
    var func = function () {
      var trackInfo = track();
      expect(trackInfo.file).to.match('.*track.js');
      expect(trackInfo.func).to.be('Context.foo');
      expect(trackInfo.line).to.eql('15');
      expect(trackInfo.index).to.eql('5');
    };
    func();
  });
});
