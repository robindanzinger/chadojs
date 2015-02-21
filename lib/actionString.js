"use strict";

var stringify = require('./stringify').stringify;

function createReturnValueActionString(returnValue) {
  return "r:"+stringify(returnValue);
}

function createCallbackActionString(callbackIndex, callbackArgs) {
  return "cb:"+callbackIndex+"->"+stringify(callbackArgs);
}

function parse(actionString) {
  if (/^r:(.*)/.test(actionString)) {
    return "returns " + actionString.substring(2);
  } else if (/^cb:/.test(actionString)) {
    var regexResult = /^cb:(\d+)->\[(.*)\]$/.exec(actionString);
    return "calls " + regexResult[1] + " argument " 
      + "with (" + regexResult[2] + ")";
  }
}

module.exports = {
  createReturnValueActionString: createReturnValueActionString,
  createCallbackActionString: createCallbackActionString,
  parse: parse
};
