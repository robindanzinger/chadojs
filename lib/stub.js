'use strict';
var track = require('./track').track;
var save = require('./save');
var stringify = require('./stringify').stringify;
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var getTestdoubleNameFor = require('./testdouble').nameFor;

function createReturnValueAssumption(repo, collaborator, funcName, args, returnValue, trackInfo) {
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].mapArgs2ReturnValue[args] = escapeUndefined(returnValue);
  saveAssumption(repo, collaborator, funcName, args, createReturnValueActionString(returnValue), trackInfo);
}

function createThrowErrorAssumption(repo, collaborator, funcName, args, errorMessage, trackInfo) {
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].mapArgs2ThrowError[args] = escapeUndefined(errorMessage);
  saveAssumption(repo, collaborator, funcName, args, createThrowErrorActionString(errorMessage), trackInfo);
}

function createCallbackAssumption(repo, collaborator, funcName, args, callbackArgs, callbackIndex, trackInfo) {
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].callbackIndex = callbackIndex;
  collaborator[funcName].mapArgs2CallbackArgs[args] = callbackArgs;
  saveAssumption(repo, collaborator, funcName, args, createCallbackActionString(callbackIndex, callbackArgs), trackInfo);
}

function saveAssumption(repo, collaborator, funcName, args, actionString, trackInfoOfAssumption) {
  var testdoubleName = getTestdoubleNameFor(collaborator);
  save([testdoubleName, funcName, args, actionString, 'assume', trackInfoOfAssumption.file, trackInfoOfAssumption.line, trackInfoOfAssumption.func, trackInfoOfAssumption.test])
    .to(repo);
}

function stub(repo, collaborator, funcName, trackInfoOfAssumption) {
  var doubleName = getTestdoubleNameFor(collaborator);

  function stubbedFunc() {
    var actualArgs = getArgumentsAsArray(arguments);
    var actualStringifiedArgs = stringify(actualArgs);
    var trackInfoCalledBy = track();
    var returnValue;

    function isCallbackDefined() {
      return collaborator[funcName].mapArgs2CallbackArgs[actualStringifiedArgs] !== undefined;
    }

    function isReturnDefined() {
      return collaborator[funcName].mapArgs2ReturnValue[actualStringifiedArgs] !== undefined;
    }

    function isThrowErrorDefined() {
      return collaborator[funcName].mapArgs2ThrowError[actualStringifiedArgs] !== undefined;
    }

    function isAssumptionDefined() {
      return isCallbackDefined() || isReturnDefined() || isThrowErrorDefined();
    }

    function throwErrorAssumptionNotDefined(trackInfo) {
      var message = 'There is no assumption defined. Did not expect function [' + funcName + '] ' +
        'is called with ' + actualArgs + ' (handled as -> ' + actualStringifiedArgs + '). \n' +
        'Expected arguments for this function are: \n' +
        Object.keys(collaborator[funcName].mapArgs2ReturnValue) +
        '\nor\n' +
        Object.keys(collaborator[funcName].mapArgs2CallbackArgs) +
        '\nFunction was called from ' + trackInfo.file + ' at line ' + trackInfo.line + '\n\n';
      throw new Error(message);
    }

    function assertIsFunction(func) {
      if (typeof func !== 'function') {
        var message = 'Argument at index ' + collaborator[funcName].callbackIndex + ' is no function.\n' +
          'Assumption was made in ' + trackInfoOfAssumption.file +
          ' at line ' + trackInfoOfAssumption.line;
        throw new Error(message);
      }
    }

    if (!isAssumptionDefined()) {
      throwErrorAssumptionNotDefined(trackInfoCalledBy);
    }
    if (isThrowErrorDefined()) {
      var errorMessage = collaborator[funcName].mapArgs2ThrowError[actualStringifiedArgs];
      save([doubleName, funcName, actualStringifiedArgs, createThrowErrorActionString(errorMessage),
             'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
        .to(repo);
      throw new Error(errorMessage);
    }
    if (isCallbackDefined()) {
      var callbackArgs = collaborator[funcName].mapArgs2CallbackArgs[actualStringifiedArgs];
      var callbackIndex = collaborator[funcName].callbackIndex;
      var cb = actualArgs[callbackIndex];
      assertIsFunction(cb);
      setTimeout(function () {
        cb.apply(undefined, callbackArgs);
      }, 0);
      save([doubleName, funcName, actualStringifiedArgs, createCallbackActionString(callbackIndex, callbackArgs),
             'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
        .to(repo);
    }
    if (isReturnDefined()) {
      returnValue = unescapeUndefined(collaborator[funcName].mapArgs2ReturnValue[actualStringifiedArgs]);
      save([doubleName, funcName, actualStringifiedArgs, createReturnValueActionString(returnValue),
             'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
        .to(repo);
    }
    return returnValue;
  }

  collaborator.chadojsBackup[funcName] = collaborator[funcName];
  stubbedFunc.mapArgs2ReturnValue = {};
  stubbedFunc.mapArgs2CallbackArgs = {};
  stubbedFunc.mapArgs2ThrowError = {};
  stubbedFunc.chadoStubbedFunction = true;
  stubbedFunc.callbackIndex = 0;

  if (!collaborator[funcName] || !collaborator[funcName].chadoStubbedFunction) {
    collaborator[funcName] = stubbedFunc;
  }
}

function popAppendingUndefinedArguments(args) {
  while (args.length > 0 && args[args.length - 1] === undefined) {
    args.pop();
  }
  return args;
}

function getArgumentsAsArray(args) {
  if (args.length === 0) {
    return undefined;
  }
  return popAppendingUndefinedArguments(Array.prototype.slice.call(args));
}

var undefinedValue = {};
function escapeUndefined(value) {
  if (value === undefined) {
    return undefinedValue;
  }
  return value;
}

function unescapeUndefined(value) {
  return value === undefinedValue ? undefined : value;
}

module.exports = {
  createReturnValueAssumption: createReturnValueAssumption,
  createThrowErrorAssumption: createThrowErrorAssumption,
  createCallbackAssumption: createCallbackAssumption,
  getArgumentsAsArray: getArgumentsAsArray
};

