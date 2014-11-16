"use strict";
var track = require('./track').track;
var save = require('./save');
function verify(repo, libName) {
  var trackInfo = track();
  var funcName;
  var args = undefined;
  var expectedReturnValue = null;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    return {
      andReturn : andReturn
    };
  }

  function andReturn(nExpectedReturnValue) {
    expectedReturnValue = nExpectedReturnValue;
    return {
      on : on
    };
  }

  function on(sut) {
    var actualReturnValue = sut[funcName].apply(sut, args);
    saveVerification();
    return actualReturnValue == expectedReturnValue; 
  }

  function saveVerification() {
    save([libName, funcName, JSON.stringify(args), expectedReturnValue, "verify", trackInfo.file, trackInfo.line]).to(repo);
  }

  return {canHandle : canHandle};
}

function create(nRepo) {
  var repo = nRepo || {};
  return verify.bind(undefined, repo);
}

module.exports = create;
