'use strict';

function findMatcher(matchers) {
  if (!Array.isArray(matchers)) {
    matchers = [matchers];
  }
  var args = Array.prototype.slice.call(arguments, 1);
  return matchers.find(matches.bind(null, args));
}

function matches(args, matcher) {
  return args.every(function (arg, index) {
      return arg === matcher.args[index];
  });
}

function createMatcher() {
  var args = Array.prototype.slice.call(arguments);
  return {
    args: args
  };
}

module.exports = {
  findMatcher: findMatcher,
  createMatcher: createMatcher
};
