'use strict';
var difference = require('lodash/difference');
var isPlainObject = require('lodash/isPlainObject');
var isEqual = require('lodash/isEqual');
var isMatch = require('lodash/isMatch');
var omit = require('lodash/omit');
var functions = require('lodash/functions');

function is(first) {
  function similarTo(second) {
    return isEqual(first, second) ||
      isPlainObject(first) && isPlainObject(second) && isMatch(replaceFunctions(second), replaceFunctions(first)) ||
      Array.isArray(first) && Array.isArray(second) && difference(first, second).length === 0 ||
      Promise.resolve(first) === first && Promise.resolve(second) === second;
  }

  return {
    similarTo: similarTo
  };
}

function replaceFunctions(obj) {
  var funcs = functions(obj);
  obj = omit(obj, funcs);
  funcs.forEach(function (f) {
    obj[f] = '=>function';
  });
  return obj;
}

module.exports = is;
