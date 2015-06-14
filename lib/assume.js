'use strict';
var track = require('./track').track;
var save = require('./save');
var stringify = require('./stringify').stringify;
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var getLibNameFor = require('./testdouble').getLibNameFor;
var callback = require('./types').callback;
var undefinedValue = {};
function assume(repo, lib) {
  var libName = getLibNameFor(lib);
  var globalTrackInfo = track();
  var funcName;
  var args;
  var globalStringifiedArgs;
  var callbackIndex = 0;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    stub();
    return {
      andReturns: andReturns,
      withArgs: withArgs,
      andThrowsError: andThrowsError
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    globalStringifiedArgs = stringify(args);
    return {
      andReturns: andReturns,
      andCallsCallbackWith: andCallsCallbackWith,
      andThrowsError: andThrowsError
    };
  }

  function andReturns(returnValue) {
    lib[funcName].mapArgs2ReturnValue[globalStringifiedArgs] = escapeUndefined(returnValue);
    saveAssumption(createReturnValueActionString(returnValue));
  }

  function andCallsCallbackWith() {
    callbackIndex = args.indexOf(callback);
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
    lib[funcName].mapArgs2CallbackArgs[globalStringifiedArgs] = argumentsWithWhichCallbackShouldBeCalled;
    saveAssumption(createCallbackActionString(callbackIndex, argumentsWithWhichCallbackShouldBeCalled));
    return {
      andReturns: andReturns
    };
  }

  function andThrowsError(message) {
    lib[funcName].mapArgs2ThrowError[globalStringifiedArgs] = escapeUndefined(message);
    saveAssumption(createThrowErrorActionString(message));
  }

  function stub() {
    if (!lib[funcName]) {
      lib[funcName] = function () {
        var actualArgs = arguments.length > 0 ? Array.prototype.slice.call(arguments) : undefined;
        var stringifiedArgs = stringify(actualArgs);
        var trackInfo = track();
        var returnValue;
        if (!isAssumptionDefined(stringifiedArgs)) {
          throwErrorAssumptionNotDefined(actualArgs, stringifiedArgs, trackInfo);
        }
        if (isThrowErrorDefined(stringifiedArgs)) {
          var errorMessage = lib[funcName].mapArgs2ThrowError[stringifiedArgs];
          save([libName, funcName, stringifiedArgs, createThrowErrorActionString(errorMessage),
            'calledBy', trackInfo.file, trackInfo.line, trackInfo.func])
            .to(repo);
          throw Error(errorMessage);
        }
        if (isCallbackDefined(stringifiedArgs)) {
          returnValue = null;
          var callbackArgs = lib[funcName].mapArgs2CallbackArgs[stringifiedArgs];
          var cb = actualArgs[callbackIndex];
          assertIsFunction(cb);
          setTimeout(function () {
            cb.apply(undefined, callbackArgs);
          }, 0);
          save([libName, funcName, stringifiedArgs, createCallbackActionString(callbackIndex, callbackArgs),
            'calledBy', trackInfo.file, trackInfo.line, trackInfo.func])
            .to(repo);
        }
        if (isReturnDefined(stringifiedArgs)) {
          returnValue = unescapeUndefined(lib[funcName].mapArgs2ReturnValue[stringifiedArgs]);
          save([libName, funcName, stringifiedArgs, createReturnValueActionString(returnValue),
            'calledBy', trackInfo.file, trackInfo.line, trackInfo.func])
            .to(repo);
        }
        return returnValue;
      };
      lib[funcName].mapArgs2ReturnValue = {};
      lib[funcName].mapArgs2CallbackArgs = {};
      lib[funcName].mapArgs2ThrowError = {};
    }
  }

  function assertIsFunction(func) {
    if (typeof func !== 'function') {
      var message = 'Argument at index ' + callbackIndex + ' is no function.\n' +
        'Assumption was made in ' + globalTrackInfo.file + ' at line ' + globalTrackInfo.line;
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

  function throwErrorAssumptionNotDefined(actualArgs, stringifiedArgs, trackInfo) {
    var message = 'Did not expect function [' + funcName + '] ' +
      'is called with ' + actualArgs + ' (handled as -> ' + stringifiedArgs + '). \n' +
      'Expected arguments for this function are: \n' +
      Object.keys(lib[funcName].mapArgs2ReturnValue) +
      '\nor\n' +
      Object.keys(lib[funcName].mapArgs2CallbackArgs) +
      '\nFunction was called from ' + trackInfo.file + ' at line ' + trackInfo.line + '\n\n';
    throw Error(message);
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
    save([libName, funcName, globalStringifiedArgs, actionString, 'assume', globalTrackInfo.file, globalTrackInfo.line, globalTrackInfo.func]).to(repo);
  }

  return {canHandle: canHandle};
}

function create(repo) {
  repo = repo || {};
  return assume.bind(undefined, repo);
}

module.exports = create;
