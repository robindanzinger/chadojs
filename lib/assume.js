'use strict';
var track = require('./track').track;
var callback = require('./types').callback;

var createReturnValueAssumption = require('./assume_core').createReturnValueAssumption;
var createThrowErrorAssumption = require('./assume_core').createThrowErrorAssumption;
var createCallbackAssumption = require('./assume_core').createCallbackAssumption;
var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

function assume(repo, collaborator) {
  var funcName;

  function andReturns(args, returnValue) {
    createReturnValueAssumption(repo, collaborator, funcName, args, returnValue, track());
  }

  function andThrowsError(args, message) {
    createThrowErrorAssumption(repo, collaborator, funcName, args, message, track());
  }

  function andCallsCallbackWith(args) {
    var callbackIndex = args.indexOf(callback);
    var argumentsWithWhichCallbackShouldBeCalled = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
    createCallbackAssumption(repo, collaborator, funcName, args, argumentsWithWhichCallbackShouldBeCalled, callbackIndex, track());
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
    var noArgs = getArgumentsAsArray();
    return {
      andReturns: andReturns.bind(null, noArgs),
      withArgs: withArgs,
      andThrowsError: andThrowsError.bind(null, noArgs)
    };
  }

  return {canHandle: canHandle};
}

function create(repo) {
  repo = repo || {};
  return assume.bind(undefined, repo);
}

module.exports = create;
