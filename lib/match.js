'use strict';
var isMatcher = require('./types').isMatcher;
var is = require('./compare');
function match(toMatch, value) {
  if (isMatcher(toMatch)) {
    return toMatch.matches(value);
  }
  if (typeof (value) === 'function' && typeof (toMatch) === 'function') {
    return true;
  }
  return is(toMatch).similarTo(value);
}

module.exports = match;
