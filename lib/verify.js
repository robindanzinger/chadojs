'use strict';

var track = require('./track').track;
var save = require('./save');
var is = require('./compare');
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var stringify = require('./stringify').stringify;
var callback = require('./types').callback;

function verify(repo, doubleName) {
  var trackInfo = track();
  var funcName;
  var args;
  var expectedReturnValue = null;
  var expectedCallbackArgs;
  var expectedErrorMessage;
  var callbackIndex = 0;
  var verifyCallback;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturns: andReturns,
      andThrowsError: andThrowsError,
      withArgs: withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    return {
      andReturns: andReturns,
      andCallsCallbackWith: andCallsCallbackWith,
      andThrowsError: andThrowsError
    };
  }

  function andReturns(nExpectedReturnValue) {
    expectedReturnValue = nExpectedReturnValue;
    return {
      on: onReturn
    };
  }

  function andCallsCallbackWith() {
    expectedCallbackArgs = Array.prototype.slice.call(arguments);
    findCallbackIndex();
    return {
      on: onCallback
    };
  }

  function findCallbackIndex() {
    callbackIndex = args.indexOf(callback);
    if (callbackIndex < 0) {
      throw new Error('No callback argument passed');
    }
  }

  function andThrowsError(nExpectedErrorMessage) {
    expectedErrorMessage = nExpectedErrorMessage;
    return {
      on: onError
    };
  }

  function onReturn(sut) {
    var actualReturnValue = doRealCall(sut);
    saveVerification(createReturnValueActionString(expectedReturnValue));
    if (!is(actualReturnValue).similarTo(expectedReturnValue)) 
    {
      throw new Error('VerificationError:' 
          + '\n  Expected return value: ' + expectedReturnValue 
          + '\n  Actual return value  : ' + actualReturnValue); 
    }
  }

  function onCallback(sut, nVerifyCallback) {
    verifyCallback = nVerifyCallback;
    replaceCallbackParameter();
    doRealCall(sut);
  }

  function onError(sut) {
    saveVerification(createThrowErrorActionString(expectedErrorMessage));
    try {
      doRealCall(sut);
      throw new Error('VerificationError: Expected that sut throws an error, but didn\'t.');
    }
    catch (error) {
      if (error.message !== expectedErrorMessage) {
        throw new Error('VerificationError:'
          + '\n Expected error message: ' + expectedErrorMessage 
          + '\n Actual error message  : ' + error.message);
      }
    }
  }

  function doRealCall(sut) {
    if (sut[funcName]) return sut[funcName].apply(sut, args);
    throw new Error('Function named "' + funcName + '" is not defined in the collaborator.');
  }
  
  function replaceCallbackParameter() {
    args[callbackIndex] = callbackFunction;
  }

  function callbackFunction() {
    var actualCallbackArgs = Array.prototype.slice.call(arguments);
    saveVerification(createCallbackActionString(callbackIndex, expectedCallbackArgs));
    if (!is(expectedCallbackArgs).similarTo(actualCallbackArgs)) 
    {
      throw new Error('VerificationError:' 
          + '\n  Expected callback arguments: ' + expectedCallbackArgs 
          + '\n  Actual callback arguments: ' + actualCallbackArgs); 
    }
    verifyCallback();
  }

  function saveVerification(actionString) {
    save([doubleName, funcName, stringify(args), 
        actionString, 'verify', 
        trackInfo.file, trackInfo.line, trackInfo.func, trackInfo.test])
      .to(repo);
  }

  return {canHandle: canHandle};
}

function create(repo) {
  return verify.bind(undefined, repo || {});
}

module.exports = create;
