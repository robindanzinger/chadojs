'use strict';
var types = require('./types');
var match = require('./match');

function findMatcher(matchers, args) {
  if (!Array.isArray(matchers)) {
    matchers = [matchers];
  }
  matchers = matchers.filter(isNotUndefined);
  return hasMatcher(matchers) ? findMostRelevantMatcher(matchers, args) : undefined;
}

function hasMatcher(matchers) {
  return matchers.length > 0;
}

function findMostRelevantMatcher(matchers, args) {
  var relevantMatchers = matchers.filter(matches.bind(null, args));
  var noMatcher = {score: -1};
  return relevantMatchers.map(calculateScore).reduce(getMatcherWithHighestScore, noMatcher).matcher;

  function calculateScore(matcher) {
    var score = 0;
    matcher.args.every(function (arg) {
      if (types.isAnyValue(arg)) {
        score += 1;
      }
      else if (!types.isAny(arg)) {
        score += 2;
      }
    });
    return {score: score, matcher: matcher};
  }

  function getMatcherWithHighestScore(prevMatcher, currentMatcher) {
    return currentMatcher.score > prevMatcher.score ? currentMatcher : prevMatcher;
  }
}

function matches(args, matcher) {
  return canIgnoreAppendingMatcherArgs() &&
    canIgnoreAppendingArgs() &&
    relevantArgsMatches();

  function canIgnoreAppendingMatcherArgs() {
    if (args.length < matcher.args.length) {
        if (!appendingValuesOptional()) {
          return false;
        }
      }
    return true;
  }
  function appendingValuesOptional () {
    return matcher.args.slice(args.length).filter(isNotUndefined).every(types.isAnyOrAnyValue);
  }
  function canIgnoreAppendingArgs() {
    if (args.length > matcher.args.length) {
      if (!lastMatcherValueIsAny() && !appendingArgsAreUndefined()) {
        return false;
      }
    }
    return true;
  }
  function lastMatcherValueIsAny() {
    return types.isAny(matcher.args[matcher.args.length - 1]);
  }
  function appendingArgsAreUndefined() {
    return args.slice(0, matcher.args.length).every(isUndefined);
  }
  function relevantArgsMatches() {
    return args.slice(0, matcher.args.length).every(function (arg, index) {
      return match(matcher.args[index], arg);
   });
  }
}

function isUndefined(value) {
  return value === undefined;
}
function isNotUndefined(value) {
  return value !== undefined;
}

function createMatcher(args) {
  return {
    args: args
  };
}

module.exports = {
  findMatcher: findMatcher,
  createMatcher: createMatcher
};
