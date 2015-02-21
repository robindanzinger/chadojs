"use strict";
var track = require('./track').track;
var save = require('./save');
var is = require('./compare');
var action = require('./action');
var stringify = require('./stringify').stringify;

function verify(repo, libName) {
  var trackInfo = track();
  var funcName;
  var args = undefined;
  var expectedReturnValue = null;
  var expectedCallbackArgs = undefined;
  var callbackIndex = 0;
  var verifyCallback;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    return {
      andReturn : andReturn,
      andCallsCallbackWith : andCallsCallbackWith
    };
  }

  function andReturn(nExpectedReturnValue) {
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

  function onReturn(sut) {
    var actualReturnValue = sut[funcName].apply(sut, args);
    saveVerification(createReturnValueActionString());
    return is(actualReturnValue).similarTo(expectedReturnValue); 
  }

  function onCallback(sut, nVerifyCallback) {
    verifyCallback = nVerifyCallback;
    replaceCallbackParameter();
    sut[funcName].apply(sut, args);
  }

  function replaceCallbackParameter() {
    args[callbackIndex] = callbackFunction;
  }

  function callbackFunction() {
    var actualCallbackArgs = Array.prototype.slice.call(arguments);
    saveVerification(createCallbackActionString(expectedCallbackArgs));
    verifyCallback(is(actualCallbackArgs).similarTo(expectedCallbackArgs));
  }

  function saveVerification(actionString) {
    save([libName, funcName, stringify(args), 
        actionString, "verify", 
        trackInfo.file, trackInfo.line, trackInfo.func])
      .to(repo);
  }

  function createReturnValueActionString() {
    return action.createReturnValueActionString(expectedReturnValue);
  }

  function createCallbackActionString() {
    return action.createCallbackActionString(callbackIndex, expectedCallbackArgs);
  }

  return {canHandle : canHandle};
}

function create(nRepo) {
  var repo = nRepo || {};
  return verify.bind(undefined, repo);
}

module.exports = create;
