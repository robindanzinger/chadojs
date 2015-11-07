'use strict';
var baseIsEqual = require('lodash/internal/baseIsEqual');

function similarTo(first) {
  return function (second) {
    return baseIsEqual(first, second, null, true);
  };
}

function is(first) {
  return {similarTo: similarTo(first)};
}

module.exports = is;
