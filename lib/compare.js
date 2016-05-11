'use strict';
var baseIsEqual = require('lodash/_baseIsEqual');

function similarTo(first) {
  return function (second) {
    return baseIsEqual(first, second, null, 3);
  };
}

function is(first) {
  return {similarTo: similarTo(first)};
}

module.exports = is;
