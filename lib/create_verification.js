"use strict";
var parse = require('./stringify').parse;
var stringify = require('./stringify').stringify;
var parseAction = require('./actionString').parseAction;
function createVerification(assumption) {
  return 'verify("' + assumption.name + '")'
       + '.canHandle("' + assumption.func + '")'
       + createArgsString(assumption.args)
       + createActionString(assumption.action);
}

function createArgsString(args) {
  if (args) {
    return '.withArgs(' + 
      parse(args)
        .map(function (arg) {return stringify(arg);})
        .join(", ") + ')';
  }
  return "";
}

function createActionString(action) {
  var action = parseAction(action);
  if (action.type === "returnValue") {
    return '.andReturns(' + stringify(action.value) + ').on(sut));';
  }
  if (action.type === "throwError") {
    return '.andThrowsError("' + action.message + '").on(sut));';
  }
  if (action.type === "callback") {
    return '.andCallsCallbackWith(' + action.callbackIndex + ', ' + stringify(action.value) + ')'
      + '.on(sut, function (result) {}));'; 
  }
}

module.exports = createVerification;
