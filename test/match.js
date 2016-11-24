'use strict';
var expect = require('must');
var match = require('../lib/match');
var types = require('../lib/types');

describe('library match ', function () {
  it('returns true when value matches exactly given rule', function () {
     expect(match(1, 1)).to.be.true();
     expect(match('aString', 'aString')).to.be.true();
  });
  it('matches identical objects and objectlike', function () {
     var value = new Date(1000);
     expect(match(value, value)).to.be.true();
     value = {foo: 'bar', bar: 'foo'};
     expect(match(value, value)).to.be.true();
     value = [1, 2, 3, 4];
     expect(match(value, value)).to.be.true();
  });
  it('matches undefined value', function () {
    expect(match(undefined, undefined)).to.be.true();
  });
  it('matches null value', function () {
    expect(match(null, null)).to.be.true();
  });
  it('two functions matches always', function () {
    expect(match(function () {}, function () {})).to.be.true();
    expect(match(types.callback, function () {})).to.be.true();
  });
  it('with date matcher', function () {
    expect(match(types.anyDate, new Date())).to.be.true();
    expect(match(types.anyDate, new Date(1000))).to.be.true();
    expect(match(types.anyDate, {})).to.be.false();
  });
  it('with anyValue matcher', function () {
    expect(match(types.anyValue, 1)).to.be.true();
    expect(match(types.anyValue, 2)).to.be.true();
    expect(match(types.anyValue, undefined)).to.be.true();
    expect(match(types.anyValue, null)).to.be.true();

  });
  it('with number matcher', function () {
    expect(match(types.anyNumber, 1)).to.be.true();
    expect(match(types.anyNumber, 9999)).to.be.true();
    expect(match(types.anyNumber, 'aString')).to.be.false();
  });
  it('with string matcher', function () {
    expect(match(types.anyString, 'aString')).to.be.true();
    expect(match(types.anyString, 9999)).to.be.false();
  });
  it('matches equal objects and objectlike', function () {
     var value1 = new Date(1000);
     var value2 = new Date(1000);
     expect(match(value1, value2)).to.be.true();
     value1 = {foo: 'bar', bar: 'foo'};
     value2 = {bar: 'foo', foo: 'bar'};
     expect(match(value1, value2)).to.be.true();
     value1 = [1, 2, 3, 4];
     value2 = [1, 2, 3, 4];
     expect(match(value1, value2)).to.be.true();
  });
  it('returns false when value doesn\'t match', function () {
    expect(match(1, 2)).to.be.false();
  });
});
