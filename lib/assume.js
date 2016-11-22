'use strict';
var track = require('./track').track;
var stringify = require('./stringify').stringify;
var callback = require('./types').callback;

var createReturnValueAssumption = require('./stub').createReturnValueAssumption;
var createThrowErrorAssumption = require('./stub').createThrowErrorAssumption;
var createCallbackAssumption = require('./stub').createCallbackAssumption;
var getArgumentsAsArray = require('./stub').getArgumentsAsArray;
var stub = require('./stub').stub;

function assume(repo, collaborator) {
  var funcName;
  var args;
  var expectedStringifiedArgs;

  function andReturns(returnValue) {
    createReturnValueAssumption(repo, collaborator, funcName, expectedStringifiedArgs, returnValue, track());
  }

  function andThrowsError(message) {
    createThrowErrorAssumption(repo, collaborator, funcName, expectedStringifiedArgs, message, track());
  }

  function andCallsCallbackWith() {
    var callbackIndex = args.indexOf(callback);
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
    createCallbackAssumption(repo, collaborator, funcName, expectedStringifiedArgs, argumentsWithWhichCallbackShouldBeCalled, callbackIndex, track());
    return {
      andReturns: andReturns
    };
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

  function canHandle(nFuncName) {
    funcName = nFuncName;
    stub(repo, collaborator, funcName, track());
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
