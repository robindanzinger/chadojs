'use strict';
var parse = require('./stringify').parse;
var stringify = require('./stringify').stringify;
var parseActionString = require('./actionString').parseActionString;

function createVerification(assumption) {
  var action = parseActionString(assumption.action);
  return 'verify("' + assumption.name + '")'
       + '.canHandle("' + assumption.func + '")'
       + createArgsString(assumption.args, action)
       + createActionString(action);
}

function createArgsString(args, action) {
  if (args) {
    return '.withArgs(' + 
      parse(args)
        .map(function (arg, index) {return stringifyAndReplaceFunction(arg, action, index); })
        .join(', ') + ')';
  }
  return '';
}

function stringifyAndReplaceFunction(arg, action, index) {
  if (typeof arg === 'function') {
    return replaceFunction(action, index);
  }
  var regexForFunction = /\"=>function\"/gi;
  var stringifiedArg = stringify(arg).replace(regexForFunction, 'function () {}');
  var regexForEscapedString = /\/=>function\"/gi;
  return stringifiedArg.replace(regexForEscapedString, '\"=>function\"');
}

function replaceFunction(action, index) {
  if (action && action.type === 'callback' && index === action.callbackIndex)
  {
    return 'callback';
  }
  return 'function () {}';
}

function createActionString(action) {
  if (action.type === 'returnValue') {
    return '.andReturns(' + stringifyAndReplaceFunction(action.value) + ').on(sut));';
  }
  if (action.type === 'throwError') {
    return '.andThrowsError("' + action.message + '").on(sut));';
  }
  if (action.type === 'callback') {
    return '.andCallsCallbackWith(' + stringifyAndReplaceFunction(action.value) + ')'
      + '.on(sut, function () {}));';
  }
}

module.exports = createVerification;
