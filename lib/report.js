"use strict";

function getVerifiedAssumptions(assumptions) {
  return convertToArray(assumptions).filter(function(assumption) {
    return assumption.verify});
}

function getNotVerifiedAssumptions(assumptions) {
  var result = [];
  return convertToArray(assumptions).filter(function(assumption) {
    return !assumption.verify});
}

function convertToArray(assumptions) {
  var result = [];
  traverseKeys(assumptions, function(obj, lib) {
    traverseKeys(obj, function(obj, func) {
      traverseKeys(obj, function(obj, args) {
        traverseKeys(obj, function(assumption, returnValue) {
          result.push({
            lib: lib, func: func, args: args, returnValue: returnValue, assume: assumption.assume, verify: assumption.verify 
          }); 
        })
      })
    })
  });
  return result;
}

function traverseKeys(obj, callback) {
  Object.keys(obj).forEach(function (key) {
    callback.call(null, obj[key], key);
  });
}

module.exports = {
  getVerifiedAssumptions : getVerifiedAssumptions,
  getNotVerifiedAssumptions : getNotVerifiedAssumptions
}
