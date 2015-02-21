"use strict";

var stringify = require('./stringify').stringify;

function createReturnValueActionString(returnValue) {
  return "r:"+stringify(returnValue);
}

function createCallbackActionString(callbackIndex, callbackArgs) {
  return "cb:"+callbackIndex+"->"+stringify(callbackArgs);
}

module.exports = {
  createReturnValueActionString: createReturnValueActionString,
  createCallbackActionString: createCallbackActionString
};
