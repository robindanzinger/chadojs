'use strict';
var callback = require('./types').callback;
var track = require('./track').track;

var createReturnValueStub = require('./assume_core').createReturnValueStub;
var createThrowErrorStub = require('./assume_core').createThrowErrorStub;
var createCallbackStub = require('./assume_core').createCallbackStub;
var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

function stub(collaborator) {
  var funcName;

  function andReturns(args, returnValue) {
    createReturnValueStub(collaborator, funcName, args, returnValue, track());
  }

  function andThrowsError(args, message) {
    createThrowErrorStub(collaborator, funcName, args, message, track());
  }

  function andCallsCallbackWith(args) {
    var callbackIndex = args.indexOf(callback);
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
    createCallbackStub(collaborator, funcName, args, argumentsWithWhichCallbackShouldBeCalled, callbackIndex, track());
    return {
      andReturns: andReturns.bind(null, args)
    };
  }

  function withArgs() {
    var args = getArgumentsAsArray(arguments);
    return {
      andReturns: andReturns.bind(null, args),
      andCallsCallbackWith: andCallsCallbackWith.bind(null, args),
      andThrowsError: andThrowsError.bind(null, args)
    };
  }

  function canHandle(nFuncName) {
    funcName = nFuncName;
    var args = getArgumentsAsArray();
    return {
      andReturns: andReturns.bind(null, args),
      withArgs: withArgs,
      andThrowsError: andThrowsError.bind(null, args)
    };
  }

  return {canHandle: canHandle};
}

module.exports = stub;
