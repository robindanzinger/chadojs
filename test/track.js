var expect = require('must');
var track = require('../lib/track').track;
describe('library track', function () {
  it('given a called function, it returns file-information about the caller', function foo () {
    var func = function () {
      var trackInfo = track();
      expect(trackInfo.file).match(".*track.js");
      expect(trackInfo.func).equal("Context.foo");
      expect(trackInfo.line).eql("12");
      expect(trackInfo.index).eql("5");
    }
    func();
  })
})
