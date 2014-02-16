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
  traverseKeys(assumptions, function(lib) {
    traverseKeys(assumptions[lib], function(func) {
      traverseKeys(assumptions[lib][func], function(args) {
        traverseKeys(assumptions[lib][func][args], function(returnValue) {
          var assumption = assumptions[lib][func][args][returnValue];
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
  Object.keys(obj).forEach(callback);
}

module.exports = {
  getVerifiedAssumptions : getVerifiedAssumptions,
  getNotVerifiedAssumptions : getNotVerifiedAssumptions
}
