"use strict";
var track = require('./track').track;
var save = require('./save');
function assume(repo, testdoubleRepo, lib) {
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
        if (lib[funcName].mapArgs2ReturnValue[args]) {
          var trackInfo = track();
          var returnValue = lib[funcName].mapArgs2ReturnValue[args];
          var storedObj = save([libName, funcName, args, returnValue, "calledBy", trackInfo.file, trackInfo.line]).to(repo);
          storedObj = trackInfo;
          return returnValue; 
        }
        throw Error("Did not expect function call with " + args + ". Expected arguments for this function are: " + lib[funcName].mapArgs2ReturnValue);
      };     
      lib[funcName].mapArgs2ReturnValue = {};
    }
  }

  function saveAssumption(expectedReturnValue) {
    var storedObj = save([libName, funcName, args, expectedReturnValue, "assume", trackInfo.file, trackInfo.line]).to(repo);
    storedObj = trackInfo;
  }

  return {canHandle : canHandle, };
}

function create(repo, testdoubleRepo) {
  repo = repo || {};
  testdoubleRepo = testdoubleRepo || require('../lib/testdouble')();
  return assume.bind(undefined, repo, testdoubleRepo);
}

module.exports = create;
