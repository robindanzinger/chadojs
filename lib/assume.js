'use strict';
var track = require('./track').track;
var callback = require('./types').callback;

var createReturnValueAssumption = require('./stub').createReturnValueAssumption;
var createThrowErrorAssumption = require('./stub').createThrowErrorAssumption;
var createCallbackAssumption = require('./stub').createCallbackAssumption;
var getArgumentsAsArray = require('./stub').getArgumentsAsArray;

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
    return {
      andReturns: andReturns.bind(null, undefined),
      withArgs: withArgs,
      andThrowsError: andThrowsError.bind(null, undefined)
    };
  }

  return {canHandle: canHandle};
}

function create(repo) {
  repo = repo || {};
  return assume.bind(undefined, repo);
}

module.exports = create;
