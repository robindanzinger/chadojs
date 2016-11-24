'use strict';
var expect = require('must');
var getArgumentsAsArray = require('../lib/arguments_helper').getArgumentsAsArray;

function exp() {
  var args = arguments;
  return {eql: function (expected) {
    expect(getArgumentsAsArray(args)).eql(expected);
  }};
}

describe('library arguments_helper ', function () {
  describe('getArgumentsAsArray', function () {
    it('transforms given arguments to an array', function () {
      exp(1).eql([1]);
      exp(1, 2, 'string').eql([1, 2, 'string']);
      exp(null).eql([null]);
      exp(null, 1, 2).eql([null, 1, 2]);
      exp(undefined, 1, 2).eql([undefined, 1, 2]);
    });
    it('pops all appending undefined values', function () {
      exp(1, undefined, undefined).eql([1]);
      exp(undefined).eql([]);
    });
    it('return empty array when called with nothing or with undefined', function () {
      exp(undefined).eql([]);
      //exp().eql([]);
    });
  });
});
