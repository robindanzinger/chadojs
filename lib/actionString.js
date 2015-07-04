'use strict';
var stringify = require('./stringify').stringify;
var parse = require('./stringify').parse;

var callbackRegex = /^cb:(\d+)->\[(.*)\]$/;
var errorRegex = /^ex:/;
var returnRegex = /^r:(.*)/;

function createReturnValueActionString(returnValue) {
  return 'r:' + stringify(returnValue);
}

function createCallbackActionString(callbackIndex, callbackArgs) {
  return 'cb:' + callbackIndex + '->' + stringify(callbackArgs);
}

function createThrowErrorActionString(message) {
  return 'ex:' + message;
}

function makeHumanReadableActionString(actionString) {
  if (returnRegex.test(actionString)) {
    return 'returns ' + actionString.substring(2);
  }
  if (callbackRegex.test(actionString)) {
    var regexResult = callbackRegex.exec(actionString);
    return 'calls ' + regexResult[1] + '. argument '
      + 'with (' + regexResult[2] + ')';
  }
  if (errorRegex.test(actionString)) {
    return 'throws Error: ' + actionString.substring(3);
  }
  throw new Error('cannot parse actionString: ' + actionString);
}

function parseActionString(actionString) {
  if (returnRegex.test(actionString)) {
    return {type: 'returnValue', value: parse(actionString.substring(2))};
  }
  if (callbackRegex.test(actionString)) {
    var regexResult = callbackRegex.exec(actionString);
    return {type: 'callback', value: parse('[' + regexResult[2] + ']'), callbackIndex: parse(regexResult[1])};
  }
  if (errorRegex.test(actionString)) {
    return {type: 'throwError', message: actionString.substring(3)};
  }
}

module.exports = {
  createReturnValueActionString: createReturnValueActionString,
  createCallbackActionString: createCallbackActionString,
  createThrowErrorActionString: createThrowErrorActionString,
  makeHumanReadableActionString: makeHumanReadableActionString,
  parseActionString: parseActionString
};
