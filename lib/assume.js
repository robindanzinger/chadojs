"use strict";
var track = require('./track').track;
var save = require('./save');
var nullValue = {};
var undefinedValue = {};
function assume(repo, testdoubleRepo, lib) {
  var libName = testdoubleRepo.getLibNameFor(lib);
  var trackInfo = track();
  var funcName;
  var args = undefined;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    stub();
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    args = JSON.stringify(args);
    return {
      andReturn : andReturn,
      andCallsCallbackWith : andCallsCallbackWith
    };
  }

  function andReturn(returnValue) {
    lib[funcName].mapArgs2ReturnValue[args] = escapeUndefined(returnValue);
    saveAssumption(returnValue);
  }

  function andCallsCallbackWith() {
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 0 ? Array.prototype.slice.call(arguments) : undefined;
    lib[funcName].mapArgs2CallbackArgs[args] = argumentsWithWhichCallbackShouldBeCalled;

    return {
      andReturn : andReturn
    }
  }

  function stub() {
    if (!lib[funcName]) {
      lib[funcName] = function () {
        var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : undefined;
        var stringifiedArgs = JSON.stringify(args);
        var trackInfo = track();
        var returnValue;
        var callback;
        if (!isCallbackDefined(stringifiedArgs) && !isReturnDefined(stringifiedArgs)) {
          throwErrorAssumptionNotDefined(args, stringifiedArgs, trackInfo);
        }
        if (isCallbackDefined(stringifiedArgs)) {
          returnValue = null;
          var callbackArgs = lib[funcName].mapArgs2CallbackArgs[stringifiedArgs];
          var cb = getFirstFunctionArgument(args);
          setTimeout(function () {
            cb.apply(undefined, callbackArgs);
          }, 0);
        }
        if (isReturnDefined(stringifiedArgs)) {
          returnValue = unescapeUndefined(lib[funcName].mapArgs2ReturnValue[stringifiedArgs]); 
        }
        var storedObj = 
          save([libName, funcName, stringifiedArgs, returnValue, 
            "calledBy", trackInfo.file, trackInfo.line, trackInfo.func])
          .to(repo);
        return returnValue;
      }
      lib[funcName].mapArgs2ReturnValue = {};
      lib[funcName].mapArgs2CallbackArgs = {};
    }
  }

  function isCallbackDefined(stringifiedArgs) {
    return lib[funcName].mapArgs2CallbackArgs[stringifiedArgs] !== undefined;
  }

  function isReturnDefined(stringifiedArgs) {
    return lib[funcName].mapArgs2ReturnValue[stringifiedArgs] !== undefined;
  }

  function throwErrorAssumptionNotDefined(args, stringifiedArgs, trackInfo)
  {
    var message = "Did not expect function [" + funcName + "] " +
                  "is called with " + args + " (handled as -> " + stringifiedArgs + "). \n" 
                  "Expected arguments for this function are: \n" + 
                  JSON.stringify(Object.keys(lib[funcName].mapArgs2ReturnValue)) + 
                  "\nor\n" +
                  JSON.stringify(Object.keys(lib[funcName].mapArgs2CallbackArgs)) + ". " +
                  "Function was called from " + trackInfo.file + " at line " + trackInfo.line;
    throw Error(message);
  }

  function getFirstFunctionArgument(args) {
    return args.filter(function (item) {return typeof item === 'function'})[0];
  }

  function escapeUndefined(value) {
    if (value === undefined) {
      return undefinedValue;
    }
    return value;
  }

  function unescapeUndefined(value) {
    if (value === undefinedValue) {
      return undefined;
    }
    return value;
 }

  function saveAssumption(expectedReturnValue) {
    var storedObj = save([libName, funcName, args, expectedReturnValue, "assume", trackInfo.file, trackInfo.line, trackInfo.func]).to(repo);
  }

  return {canHandle : canHandle, };
}

function create(repo, testdoubleRepo) {
  repo = repo || {};
  testdoubleRepo = testdoubleRepo || require('../lib/testdouble')();
  return assume.bind(undefined, repo, testdoubleRepo);
}

module.exports = create;
