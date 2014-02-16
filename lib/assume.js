"use strict";
var track = require('./track').track;
var testdoubleRepo;
var repo;
function assume(lib) {
  var libName = testdoubleRepo.getLibNameFor(lib);
  var trackInfo = track();
  var funcName;
  var args = null;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    args = JSON.stringify(args);
    return {
      andReturn : andReturn
    };
  }

  function andReturn(returnValue) {
    stub();
    lib[funcName].mapArgs2ReturnValue[args] = returnValue;
    saveAssumption(returnValue);
    return trackInfo;
  }

  function stub() {
    if (!lib[funcName]) {
      lib[funcName] = function () {
        var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : null;
        args = JSON.stringify(args);
        if (lib[funcName].mapArgs2ReturnValue[args]) 
          return lib[funcName].mapArgs2ReturnValue[args];
        throw Error("Did not expect function call with " + args + ". Expected arguments for this function are: " + lib[funcName].mapArgs2ReturnValue);
      };     
      lib[funcName].mapArgs2ReturnValue = {};
    }
  }

  function saveAssumption(expectedReturnValue) {
    var storedObj = [libName, funcName, args, expectedReturnValue, "assume", trackInfo.file, trackInfo.line]
      .reduce(function (obj, key) {
          if (!obj[key])
            {obj[key] = {}};
          return obj[key];
        }, repo);
    storedObj = trackInfo;
  }

  return {canHandle : canHandle}
}

function create(nRepo, nTestdoubleRepo) {
  repo = nRepo || {};
  testdoubleRepo = nTestdoubleRepo || require('../lib/testdouble')();
  return assume;
}

module.exports = create;
