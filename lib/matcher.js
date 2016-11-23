'use strict';
var anyValue = require('./types').anyValue;
var any = require('./types').any;

function findMatcher(matchers) {
  if (!Array.isArray(matchers)) {
    matchers = [matchers];
  }
  var args = Array.prototype.slice.call(arguments, 1);
  return findMostRelevantMatcher(matchers, args);
}

function findMostRelevantMatcher(matchers, args) {
  var relevantMatchers = matchers.filter(matches.bind(null, args));
  if (relevantMatchers.length === 0) {
    return undefined;
  }
  if (relevantMatchers.length === 1) {
    return relevantMatchers[0];
  }
  var matchingScore = 0;
  var mostRelevantMatcher = relevantMatchers[0];
  relevantMatchers.forEach(function (matcher) {
    var score = 0;
    matcher.args.every(function (arg) {
      if (isAnyValue(arg)) {
        score++;
      }
      else if (!isAny(arg)) {
        score += 2;
      }
    });
    if (score > matchingScore) {
      matchingScore = score;
      mostRelevantMatcher = matcher;
    }
  });
  return mostRelevantMatcher;
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
    return matcher.args.slice(args.length).every(isAnyOrAnyValue);
  }
  function canIgnoreAppendingArgs() {
    if (args.length > matcher.args.length) {
      if (!lastMatcherValueIsAny()) {
        return false;
      }
    }
    return true;
  }
  function lastMatcherValueIsAny() {
    return matcher.args[matcher.args.length - 1] === any;
  }
  function relevantArgsMatches() {
    return args.slice(0, matcher.args.length).every(function (arg, index) {
      return isAnyOrAnyValue(matcher.args[index])
        || arg === matcher.args[index];
    });
  }
}

function isAny(value) {
  return value === any;
}

function isAnyValue(value) {
  return value === anyValue;
}

function isAnyOrAnyValue(value) {
  return isAny(value) || isAnyValue(value);
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
