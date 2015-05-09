"use strict";

var stringify = require('./stringify').stringify;
var parse = require('./stringify').parse;

function createReturnValueActionString(returnValue) {
  return "r:"+stringify(returnValue);
}

function createCallbackActionString(callbackIndex, callbackArgs) {
  return "cb:"+callbackIndex+"->"+stringify(callbackArgs);
}

function createThrowErrorActionString(message) {
  return "ex:"+message;
}

function makeHumanReadableActionString(actionString) {
  if (/^r:(.*)/.test(actionString)) {
    return "returns " + actionString.substring(2);
  } else if (/^cb:(\d+)->\[(.*)\]$/.test(actionString)) {
    var regexResult = /^cb:(\d+)->\[(.*)\]$/.exec(actionString);
    return "calls " + regexResult[1] + ". argument " 
      + "with (" + regexResult[2] + ")";
  } else if (/^ex:/.test(actionString)) {
    return "throws Error: " + actionString.substring(3);
  }
  throw Error("cannot parse actionString: " + actionString);
}

function parseAction(actionString) {
  if (/^r:(.*)/.test(actionString)) {
    return {type:"returnValue", value:parse(actionString.substring(2))};
  } else if (/^cb:/.test(actionString)) {
    var regexResult = /^cb:(\d+)->\[(.*)\]$/.exec(actionString);
    return {type:"callback", value:parse(regexResult[2]), callbackIndex:parse(regexResult[1])};
  } else if (/^ex:/.test(actionString)) {
    return {type:"throwError", message:actionString.substring(3)};
  }
}

module.exports = {
  createReturnValueActionString: createReturnValueActionString,
  createCallbackActionString: createCallbackActionString,
  createThrowErrorActionString: createThrowErrorActionString,
  makeHumanReadableActionString: makeHumanReadableActionString,
  parseAction: parseAction
};
