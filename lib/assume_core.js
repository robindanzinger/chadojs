'use strict';
var track = require('./track').track;
var save = require('./save');
var stringify = require('./stringify').stringify;
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var getTestdoubleNameFor = require('./testdouble').nameFor;
var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;
var findMatcher = require('./matcher').findMatcher;
var createMatcher = require('./matcher').createMatcher;

function createReturnValueAssumption(repo, collaborator, funcName, args, returnValue, trackInfo) {
  args = stringify(args);
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].mapArgs2ReturnValue[args] = escapeUndefined(returnValue);
  saveAssumption(repo, collaborator, funcName, args, createReturnValueActionString(returnValue), trackInfo);
}

function createThrowErrorAssumption(repo, collaborator, funcName, args, errorMessage, trackInfo) {
  args = stringify(args);
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].mapArgs2ThrowError[args] = escapeUndefined(errorMessage);
  saveAssumption(repo, collaborator, funcName, args, createThrowErrorActionString(errorMessage), trackInfo);
}

function createCallbackAssumption(repo, collaborator, funcName, args, callbackArgs, callbackIndex, trackInfo) {
  args = stringify(args);
  stub(repo, collaborator, funcName, trackInfo);
  collaborator[funcName].mapArgs2CallbackArgs[args] = {};
  collaborator[funcName].mapArgs2CallbackArgs[args].callbackIndex = callbackIndex;
  collaborator[funcName].mapArgs2CallbackArgs[args].args = callbackArgs;
  saveAssumption(repo, collaborator, funcName, args, createCallbackActionString(callbackIndex, callbackArgs), trackInfo);
}

function createReturnValueStub(collaborator, funcName, args, returnValue, trackInfo) {
  stub(undefined, collaborator, funcName, trackInfo);
  var matcher = createMatcher(args);
  matcher.returnValue = escapeUndefined(returnValue);
  collaborator[funcName].returnValueStubMatcher.push(matcher);
}

function createThrowErrorStub(collaborator, funcName, args, errorMessage, trackInfo) {
  stub(undefined, collaborator, funcName, trackInfo);
  var matcher = createMatcher(args);
  matcher.errorMessage = escapeUndefined(errorMessage);
  collaborator[funcName].throwErrorStubMatcher.push(matcher);
}

function createCallbackStub(collaborator, funcName, args, callbackArgs, callbackIndex, trackInfo) {
  stub(undefined, collaborator, funcName, trackInfo);
  var matcher = createMatcher(args);
  matcher.callbackIndex = callbackIndex;
  matcher.callbackArgs = callbackArgs;
  collaborator[funcName].callbackStubMatcher.push(matcher);
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

    function assertIsFunction(func, callbackIndex) {
      if (typeof func !== 'function') {
        var message = 'Argument at index ' + callbackIndex + ' is no function.\n' +
          'Assumption was made in ' + trackInfoOfAssumption.file +
          ' at line ' + trackInfoOfAssumption.line;
        throw new Error(message);
      }
    }

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

    function isReturnStubDefined() {
      return getReturnValueStubMatcher() !== undefined;
    }

    function getReturnValueStubMatcher() {
      return findMatcher(collaborator[funcName].returnValueStubMatcher, actualArgs);
    }

    function isThrowErrorStubDefined() {
      return getThrowErrorStubMatcher() !== undefined;
    }

    function getThrowErrorStubMatcher() {
      return findMatcher(collaborator[funcName].throwErrorStubMatcher, actualArgs);
    }

    function isCallbackStubDefined() {
      return getCallbackStubMatcher() !== undefined;
    }

    function getCallbackStubMatcher() {
      return findMatcher(collaborator[funcName].callbackStubMatcher, actualArgs);
    }

    function isStubDefined() {
       return isCallbackStubDefined() || isReturnStubDefined() || isThrowErrorStubDefined();
    }

    function handleAssumptionCall() {
      var returnValue;
      if (isThrowErrorDefined()) {
        var errorMessage = collaborator[funcName].mapArgs2ThrowError[actualStringifiedArgs];
        save([doubleName, funcName, actualStringifiedArgs, createThrowErrorActionString(errorMessage),
               'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
          .to(repo);
        throw new Error(errorMessage);
      }
      if (isCallbackDefined()) {
        var callbackData = collaborator[funcName].mapArgs2CallbackArgs[actualStringifiedArgs];
        var callbackArgs = callbackData.args;
        var callbackIndex = callbackData.callbackIndex;
        var cb = actualArgs[callbackIndex];
        assertIsFunction(cb, callbackIndex);
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

    function handleStubCall() {
      var returnValue;
      if (isThrowErrorStubDefined()) {
        var errorMessage = unescapeUndefined(getThrowErrorStubMatcher().errorMessage);
        throw new Error(errorMessage);
      }
      if (isCallbackStubDefined()) {
        var matcher = getCallbackStubMatcher();
        var callbackArgs = matcher.callbackArgs;
        var callbackIndex = matcher.callbackIndex;
        var cb = actualArgs[callbackIndex];
        assertIsFunction(cb, callbackIndex);
        setTimeout(function () {
          cb.apply(undefined, callbackArgs);
        }, 0);
      }
      if (isReturnStubDefined()) {
         returnValue = unescapeUndefined(getReturnValueStubMatcher().returnValue);
      }
      return returnValue;
    }

    if (isAssumptionDefined()) {
      return handleAssumptionCall();
    }
    else if (isStubDefined()) {
      return handleStubCall();
    }
    else {
      throwErrorAssumptionNotDefined(trackInfoCalledBy);
    }
  }
  collaborator.chadojsBackup[funcName] = collaborator[funcName];
  stubbedFunc.mapArgs2ReturnValue = {};
  stubbedFunc.mapArgs2CallbackArgs = {};
  stubbedFunc.mapArgs2ThrowError = {};
  stubbedFunc.returnValueStubMatcher = [];
  stubbedFunc.callbackStubMatcher = [];
  stubbedFunc.throwErrorStubMatcher = [];

  stubbedFunc.chadoStubbedFunction = true;
  stubbedFunc.callbackIndex = 0;

  if (!collaborator[funcName] || !collaborator[funcName].chadoStubbedFunction) {
    collaborator[funcName] = stubbedFunc;
  }
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
  createReturnValueStub: createReturnValueStub,
  createThrowErrorStub: createThrowErrorStub,
  createCallbackStub: createCallbackStub
};

