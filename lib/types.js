'use strict';

function Matcher(type, matcherFunc) {
  this.type = type;
  this.matches = matcherFunc;
}

var any = new Matcher('any', function() {return true;});
var anyValue = new Matcher('anyValue', function() {return true;});
var anyDate = new Matcher('anyDate', function (value) {return value instanceof Date;});
var anyNumber = new Matcher('anyNumber', function (value) {return typeof value === 'number';});
var anyString = new Matcher('anyString', function (value) {return typeof value === 'string';});

function isAny(value) {
  return value === any;
}

function isAnyValue(value) {
  return value === anyValue;
}

function isAnyOrAnyValue(value) {
  return isAny(value) || isAnyValue(value);
}

function isMatcher(value) {
  return value instanceof Matcher;
}

module.exports = {
  callback: function () {},
  anyValue: anyValue,
  any: any,
  anyDate: anyDate,
  anyNumber: anyNumber,
  anyString: anyString,
  isAny: isAny,
  isAnyValue: isAnyValue,
  isAnyOrAnyValue: isAnyOrAnyValue,
  isMatcher: isMatcher
};
