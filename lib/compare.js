'use strict';
var baseIsEqual = require('lodash/_baseIsEqual');

function is(first) {
  function similarTo() {
    return function (second) {
      return baseIsEqual(first, second, null, 3);
    };
  }

  return {similarTo: similarTo()};
}

module.exports = is;
