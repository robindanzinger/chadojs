'use strict';
var track = require('./track').track;
var save = require('./save');
var stringify = require('./stringify').stringify;
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var callback = require('./types').callback;
var undefinedValue = {};

function assume(repo, collaborator) {
  var doubleName = require('./testdouble').nameFor(collaborator);
  var trackInfoOfAssumption = track();
  var funcName;
  var args;
  var expectedStringifiedArgs;
  var callbackIndex = 0;

  function popAppendingUndefinedArguments(argus) {
    while (argus.length > 0 && argus[argus.length - 1] === undefined) {
      argus.pop();
    }
    return argus;
  }

  function getArgumentsAsArray(argus) {
    if (argus.length === 0) {
      return undefined;
    }
    return popAppendingUndefinedArguments(Array.prototype.slice.call(argus));
  }

  function escapeUndefined(value) {
    if (value === undefined) {
      return undefinedValue;
    }
    return value;
  }

  function saveAssumption(actionString) {
    save([doubleName, funcName, expectedStringifiedArgs, actionString, 'assume', trackInfoOfAssumption.file, trackInfoOfAssumption.line, trackInfoOfAssumption.func, trackInfoOfAssumption.test]).to(repo);
  }

  function andReturns(returnValue) {
    collaborator[funcName].mapArgs2ReturnValue[expectedStringifiedArgs] = escapeUndefined(returnValue);
    saveAssumption(createReturnValueActionString(returnValue));
  }

  function andCallsCallbackWith() {
    callbackIndex = args.indexOf(callback);
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
    collaborator[funcName].mapArgs2CallbackArgs[expectedStringifiedArgs] = argumentsWithWhichCallbackShouldBeCalled;
    saveAssumption(createCallbackActionString(callbackIndex, argumentsWithWhichCallbackShouldBeCalled));
    return {
      andReturns: andReturns
    };
  }

  function andThrowsError(message) {
    collaborator[funcName].mapArgs2ThrowError[expectedStringifiedArgs] = escapeUndefined(message);
    saveAssumption(createThrowErrorActionString(message));
  }

  function withArgs() {
    args = getArgumentsAsArray(arguments);
    expectedStringifiedArgs = stringify(args);
    return {
      andReturns: andReturns,
      andCallsCallbackWith: andCallsCallbackWith,
      andThrowsError: andThrowsError
    };
  }

  function assertIsFunction(func) {
    if (typeof func !== 'function') {
      var message = 'Argument at index ' + callbackIndex + ' is no function.\n' +
        'Assumption was made in ' + trackInfoOfAssumption.file +
        ' at line ' + trackInfoOfAssumption.line;
      throw new Error(message);
    }
  }

  function isCallbackDefined(actualStringifiedArgs) {
    return collaborator[funcName].mapArgs2CallbackArgs[actualStringifiedArgs] !== undefined;
  }

  function isReturnDefined(actualStringifiedArgs) {
    return collaborator[funcName].mapArgs2ReturnValue[actualStringifiedArgs] !== undefined;
  }

  function isThrowErrorDefined(actualStringifiedArgs) {
    return collaborator[funcName].mapArgs2ThrowError[actualStringifiedArgs] !== undefined;
  }

  function isAssumptionDefined(actualStringifiedArgs) {
    return isCallbackDefined(actualStringifiedArgs)
      || isReturnDefined(actualStringifiedArgs)
      || isThrowErrorDefined(actualStringifiedArgs);
  }

  function unescapeUndefined(value) {
    if (value === undefinedValue) {
      return undefined;
    }
    return value;
  }

  function throwErrorAssumptionNotDefined(actualArgs, actualStringifiedArgs, trackInfo) {
    var message = 'There is no assumption defined. Did not expect function [' + funcName + '] ' +
      'is called with ' + actualArgs + ' (handled as -> ' + actualStringifiedArgs + '). \n' +
      'Expected arguments for this function are: \n' +
      Object.keys(collaborator[funcName].mapArgs2ReturnValue) +
      '\nor\n' +
      Object.keys(collaborator[funcName].mapArgs2CallbackArgs) +
      '\nFunction was called from ' + trackInfo.file + ' at line ' + trackInfo.line + '\n\n';
    throw new Error(message);
  }

  function stub() {
    if (!collaborator[funcName] || !collaborator[funcName].chadoStubbedFunction) {
      var stubbedFunc = function () {
        var actualArgs = getArgumentsAsArray(arguments);
        var actualStringifiedArgs = stringify(actualArgs);
        var trackInfoCalledBy = track();
        var returnValue;
        if (!isAssumptionDefined(actualStringifiedArgs)) {
          throwErrorAssumptionNotDefined(actualArgs, actualStringifiedArgs, trackInfoCalledBy);
        }
        if (isThrowErrorDefined(actualStringifiedArgs)) {
          var errorMessage = collaborator[funcName].mapArgs2ThrowError[actualStringifiedArgs];
          save([doubleName, funcName, actualStringifiedArgs, createThrowErrorActionString(errorMessage),
                 'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
            .to(repo);
          throw new Error(errorMessage);
        }
        if (isCallbackDefined(actualStringifiedArgs)) {
          returnValue = null;
          var callbackArgs = collaborator[funcName].mapArgs2CallbackArgs[actualStringifiedArgs];
          var cb = actualArgs[callbackIndex];
          assertIsFunction(cb);
          setTimeout(function () {
            cb.apply(undefined, callbackArgs);
          }, 0);
          save([doubleName, funcName, actualStringifiedArgs, createCallbackActionString(callbackIndex, callbackArgs),
                 'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
            .to(repo);
        }
        if (isReturnDefined(actualStringifiedArgs)) {
          returnValue = unescapeUndefined(collaborator[funcName].mapArgs2ReturnValue[actualStringifiedArgs]);
          save([doubleName, funcName, actualStringifiedArgs, createReturnValueActionString(returnValue),
                 'calledBy', trackInfoCalledBy.file, trackInfoCalledBy.line, trackInfoCalledBy.func, trackInfoCalledBy.test])
            .to(repo);
        }
        return returnValue;
      };

      collaborator.chadojsBackup[funcName] = collaborator[funcName];
      stubbedFunc.mapArgs2ReturnValue = {};
      stubbedFunc.mapArgs2CallbackArgs = {};
      stubbedFunc.mapArgs2ThrowError = {};
      stubbedFunc.chadoStubbedFunction = true;
      collaborator[funcName] = stubbedFunc;
    }
  }

  function canHandle(nFuncName) {
    funcName = nFuncName;
    stub();
    return {
      andReturns: andReturns,
      withArgs: withArgs,
      andThrowsError: andThrowsError
    };
  }

  return {canHandle: canHandle};
}

function create(repo) {
  repo = repo || {};
  return assume.bind(undefined, repo);
}

module.exports = create;
