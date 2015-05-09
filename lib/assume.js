"use strict";
var track = require('./track').track;
var save = require('./save');
var stringify = require('./stringify').stringify;
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var getLibNameFor = require('./testdouble').getLibNameFor;
var nullValue = {};
var undefinedValue = {};
function assume(repo, lib) {
  var libName = getLibNameFor(lib);
  var trackInfo = track();
  var funcName;
  var args = undefined;
  var callbackIndex = 0;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    stub();
    return {
      andReturns : andReturns,
      withArgs : withArgs,
      andThrowsError : andThrowsError     
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    args = stringify(args);
    return {
      andReturns : andReturns,
      andCallsCallbackWith : andCallsCallbackWith,
      andThrowsError : andThrowsError
    };
  }

  function andReturns(returnValue) {
    lib[funcName].mapArgs2ReturnValue[args] = escapeUndefined(returnValue);
    saveAssumption(createReturnValueActionString(returnValue));
  }

  function andCallsCallbackWith(nCallbackIndex) {
    callbackIndex = nCallbackIndex;
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
    lib[funcName].mapArgs2CallbackArgs[args] = argumentsWithWhichCallbackShouldBeCalled;
    saveAssumption(createCallbackActionString(1, argumentsWithWhichCallbackShouldBeCalled));
    return {
      andReturns : andReturns
    }
  }

  function andThrowsError(message) {
    lib[funcName].mapArgs2ThrowError[args] = escapeUndefined(message);
    saveAssumption(createThrowErrorActionString(message)); 
  }

  function stub() {
    if (!lib[funcName]) {
      lib[funcName] = function () {
        var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : undefined;
        var stringifiedArgs = stringify(args);
        var trackInfo = track();
        var returnValue;
        var callback;
        if (!isAssumptionDefined(stringifiedArgs)) {
          throwErrorAssumptionNotDefined(args, stringifiedArgs, trackInfo);
        }
        if (isThrowErrorDefined(stringifiedArgs)) {
          handleThrowErrorAssumptionCalled(stringifiedArgs);
       }
        if (isCallbackDefined(stringifiedArgs)) {
          returnValue = null;
          var callbackArgs = lib[funcName].mapArgs2CallbackArgs[stringifiedArgs];
          var cb = args[callbackIndex];
          assertIsFunction(cb);
          setTimeout(function () {
            cb.apply(undefined, callbackArgs);
          }, 0);
          var storedObj = 
          save([libName, funcName, stringifiedArgs, createCallbackActionString(1, callbackArgs), 
              "calledBy", trackInfo.file, trackInfo.line, trackInfo.func])
            .to(repo);
        }
        if (isReturnDefined(stringifiedArgs)) {
          returnValue = unescapeUndefined(lib[funcName].mapArgs2ReturnValue[stringifiedArgs]);
          var storedObj = 
            save([libName, funcName, stringifiedArgs, createReturnValueActionString(returnValue), 
              "calledBy", trackInfo.file, trackInfo.line, trackInfo.func])
            .to(repo);
        }
        return returnValue;
      }
      lib[funcName].mapArgs2ReturnValue = {};
      lib[funcName].mapArgs2CallbackArgs = {};
      lib[funcName].mapArgs2ThrowError = {};
    }
  }

  function assertIsFunction(func) {
    if (typeof func !== 'function') {
      var message = "Argument at index " + callbackIndex + " is no function.\n" +
                    "Assumption was made in " + trackInfo.file + " at line " + trackInfo.line;
      throw Error(message);
    }
  }

  function isAssumptionDefined(stringifiedArgs) {
    return isCallbackDefined(stringifiedArgs) 
            || isReturnDefined(stringifiedArgs)
            || isThrowErrorDefined(stringifiedArgs); 
  }

  function isCallbackDefined(stringifiedArgs) {
    return lib[funcName].mapArgs2CallbackArgs[stringifiedArgs] !== undefined;
  }

  function isReturnDefined(stringifiedArgs) {
    return lib[funcName].mapArgs2ReturnValue[stringifiedArgs] !== undefined;
  }

  function isThrowErrorDefined(stringifiedArgs) {
    return lib[funcName].mapArgs2ThrowError[stringifiedArgs] !== undefined;
  }

  function throwErrorAssumptionNotDefined(args, stringifiedArgs, trackInfo)
  {
    var message = "Did not expect function [" + funcName + "] " +
                  "is called with " + args + " (handled as -> " + stringifiedArgs + "). \n" +
                  "Expected arguments for this function are: \n" + 
                  Object.keys(lib[funcName].mapArgs2ReturnValue) + 
                  "\nor\n" +
                  Object.keys(lib[funcName].mapArgs2CallbackArgs) + 
                  "\nFunction was called from " + trackInfo.file + " at line " + trackInfo.line + "\n\n";
    throw Error(message);
  }

  function handleThrowErrorAssumptionCalled(stringifiedArgs) {
    var errorMessage = lib[funcName].mapArgs2ThrowError[stringifiedArgs];
    throw Error(errorMessage);
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

  function saveAssumption(actionString) {
    var storedObj = save([libName, funcName, args, actionString, "assume", trackInfo.file, trackInfo.line, trackInfo.func]).to(repo);
  }

  return {canHandle : canHandle, };
}

function create(repo) {
  repo = repo || {};
  return assume.bind(undefined, repo);
}

module.exports = create;
