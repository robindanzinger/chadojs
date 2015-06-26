'use strict';
var parse = require('./stringify').parse;
var stringify = require('./stringify').stringify;
var parseAction = require('./actionString').parseAction;

function createVerification(assumption) {
  var action = parseAction(assumption.action);
  return 'verify("' + assumption.name + '")'
       + '.canHandle("' + assumption.func + '")'
       + createArgsString(assumption.args, action)
       + createActionString(action);
}

function createArgsString(args, action) {
  if (args) {
    return '.withArgs(' + 
      parse(args)
        .map(function (arg, index) {return stringifyArg(arg, action, index); })
        .join(', ') + ')';
  }
  return '';
}

function stringifyArg(arg, action, index){
  if (typeof arg === 'function' && action.type === 'callback' && index === action.callbackIndex)
  {
    return 'callback';
  }
  if (typeof arg === 'function') {
    return 'function () {}';
  }
  return stringify(arg);
}

function createActionString(action) {
  if (action.type === 'returnValue') {
    return '.andReturns(' + stringify(action.value) + ').on(sut));';
  }
  if (action.type === 'throwError') {
    return '.andThrowsError("' + action.message + '").on(sut));';
  }
  if (action.type === 'callback') {
    return '.andCallsCallbackWith(' + stringify(action.value) + ')'
      + '.on(sut, function () {}));';
  }
}

module.exports = createVerification;
