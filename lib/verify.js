"use strict";
var track = require('./track').track;
var save = require('./save');
var is = require('./compare');
var createCallbackActionString = require('./actionString').createCallbackActionString;
var createReturnValueActionString = require('./actionString').createReturnValueActionString;
var createThrowErrorActionString = require('./actionString').createThrowErrorActionString;
var stringify = require('./stringify').stringify;

function verify(repo, libName) {
  var trackInfo = track();
  var funcName;
  var args = undefined;
  var expectedReturnValue = null;
  var expectedCallbackArgs = undefined;
  var expectedErrorMessage = undefined;
  var callbackIndex = 0;
  var verifyCallback;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturns : andReturns,
      andThrowsError : andThrowsError,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    return {
      andReturns : andReturns,
      andCallsCallbackWith : andCallsCallbackWith,
      andThrowsError : andThrowsError
    };
  }

  function andReturns(nExpectedReturnValue) {
    expectedReturnValue = nExpectedReturnValue;
    return {
      on : onReturn
    };
  }

  function andCallsCallbackWith(nCallbackIndex) {
    callbackIndex = nCallbackIndex;
    expectedCallbackArgs = Array.prototype.slice.call(arguments, 1);
    return {
      on : onCallback
    };
  }

  function andThrowsError(nExpectedErrorMessage) {
    expectedErrorMessage = nExpectedErrorMessage;
    return {
      on : onError
    };
  }

  function onReturn(sut) {
    var actualReturnValue = sut[funcName].apply(sut, args);
    saveVerification(createReturnValueActionString(expectedReturnValue));
    return is(actualReturnValue).similarTo(expectedReturnValue); 
  }

  function onCallback(sut, nVerifyCallback) {
    verifyCallback = nVerifyCallback;
    replaceCallbackParameter();
    sut[funcName].apply(sut, args);
  }

  function onError(sut) {
    saveVerification(createThrowErrorActionString(expectedErrorMessage));
    try {
      sut[funcName].apply(sut, args);
      throw Error("Expected sut throws an error");
    }
    catch (error) {
      return error.message == expectedErrorMessage;
    }
  }

  function replaceCallbackParameter() {
    args[callbackIndex] = callbackFunction;
  }

  function callbackFunction() {
    var actualCallbackArgs = Array.prototype.slice.call(arguments);
    saveVerification(createCallbackActionString(callbackIndex, expectedCallbackArgs));
    verifyCallback(is(actualCallbackArgs).similarTo(expectedCallbackArgs));
  }

  function saveVerification(actionString) {
    save([libName, funcName, stringify(args), 
        actionString, "verify", 
        trackInfo.file, trackInfo.line, trackInfo.func])
      .to(repo);
  }

  return {canHandle : canHandle};
}

function create(nRepo) {
  var repo = nRepo || {};
  return verify.bind(undefined, repo);
}

module.exports = create;
