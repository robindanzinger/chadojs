var buster = require('buster');
var assert = buster.assert;
var track = require('../lib/track').track;
buster.testCase("library track", {
  "given a called function, it returns file-information about the caller" : function () {
    var func = function () {
      var trackInfo = track();
      assert(trackInfo.file.match(".*track.js"));
      assert.equals(trackInfo.func, "Object.buster.testCase.given a called function, it returns file-information about the caller");
      assert.equals(trackInfo.line, "13");
      assert.equals(trackInfo.index, "5");
    }
    func();
  }
})
