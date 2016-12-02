'use strict';
var difference = require('lodash/difference');
var isPlainObject = require('lodash/isPlainObject');
var isEqual = require('lodash/isEqual');
var isMatch = require('lodash/isMatch');

function is(first) {
  function similarTo() {
    return function (second) {
      return isEqual(first, second) ||
        isPlainObject(first) && isMatch(first, second) ||
        isPlainObject(second) && isMatch(second, first) ||
        Array.isArray(first) && difference(first, second).length === 0;
    };
  }

  return {similarTo: similarTo()};
}

module.exports = is;
