"use strict";
var track = require('./track').track;
var repo;
function verify(libName) {
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
    var obj = [libName, funcName, JSON.stringify(args), expectedReturnValue, "verify", trackInfo.file, trackInfo.line]
      .reduce(function (obj, key) {
          if (!obj[key])
            {obj[key] = {}};
          return obj[key];
        }, repo);
    obj = trackInfo;
  }

  return {canHandle : canHandle}
}

function create(nRepo) {
  repo = nRepo || {};
  return verify;
}

module.exports = create;
