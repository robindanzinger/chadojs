'use strict';

var track = require('./track').track;
var save = require('./save');
var is = require('./compare');
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var stringify = require('./stringify').stringify;
var callback = require('./types').callback;
var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

function verify(repo, doubleName) {
  var trackInfo = track();
  var funcName;
  var args;
  var expectedReturnValue = null;
  var expectedCallbackArgs;
  var expectedErrorMessage;
  var callbackIndex = 0;
  var verifyCallback;

  function doRealCall(sut) {
    if (sut[funcName]) { return sut[funcName].apply(sut, args); }
    throw new Error('Function named "' + funcName + '" is not defined in the collaborator.');
  }

  function saveVerification(actionString) {
    save([doubleName, funcName, stringify(args),
           actionString, 'verify',
           trackInfo.file, trackInfo.line, trackInfo.func, trackInfo.test])
      .to(repo);
  }

  function assertIsSimilar(expected, actual, type) {
    function stringifyErrorArgument(value) {
      if (Number.isNaN(value) || value === undefined || value === null) {
        return value;
      }
      return JSON.stringify(value);
    }

    if (!is(expected).similarTo(actual)) {
      throw new Error('VerificationError:'
        + '\n  Expected ' + type + ': ' + stringifyErrorArgument(expected)
        + '\n    Actual ' + type + ': ' + stringifyErrorArgument(actual));
    }
  }

  function onReturn(sut) {
    var actualReturnValue = doRealCall(sut);
    saveVerification(createReturnValueActionString(expectedReturnValue));
    assertIsSimilar(expectedReturnValue, actualReturnValue, 'return value');
  }

  function andReturns(nExpectedReturnValue) {
    expectedReturnValue = nExpectedReturnValue;
    return {
      on: onReturn
    };
  }

  function onCallback(sut, nVerifyCallback) {
    function replaceCallbackParameter() {
      function callbackFunction() {
        var actualCallbackArgs = Array.prototype.slice.call(arguments);
        saveVerification(createCallbackActionString(callbackIndex, expectedCallbackArgs));
        assertIsSimilar(expectedCallbackArgs, actualCallbackArgs, 'callback arguments');
        verifyCallback();
      }

      args[callbackIndex] = callbackFunction;
    }

    verifyCallback = nVerifyCallback;
    replaceCallbackParameter();
    doRealCall(sut);
  }

  function andCallsCallbackWith() {
    function findCallbackIndex() {
      callbackIndex = args.indexOf(callback);
      if (callbackIndex < 0) {
        throw new Error('No callback argument passed');
      }
    }

    expectedCallbackArgs = Array.prototype.slice.call(arguments);
    findCallbackIndex();
    return {
      on: onCallback
    };
  }

  function onError(sut) {
    saveVerification(createThrowErrorActionString(expectedErrorMessage));
    try {
      doRealCall(sut);
    }
    catch (error) {
      assertIsSimilar(expectedErrorMessage, error.message, 'error message');
      return;
    }
    throw new Error('VerificationError: Expected that sut throws an error, but didn\'t.');
  }

  function andThrowsError(nExpectedErrorMessage) {
    expectedErrorMessage = nExpectedErrorMessage;
    return {
      on: onError
    };
  }

  function withArgs() {
    args = getArgumentsAsArray(arguments);
    return {
      andReturns: andReturns,
      andCallsCallbackWith: andCallsCallbackWith,
      andThrowsError: andThrowsError
    };
  }

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturns: andReturns,
      andThrowsError: andThrowsError,
      withArgs: withArgs
    };
  }

  return {canHandle: canHandle};
}

function create(repo) {
  return verify.bind(undefined, repo || {});
}

module.exports = create;
