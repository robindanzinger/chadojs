'use strict';

var expect = require('must');
var stringify = require('../lib/stringify').stringify;
var createVerification = require('../lib/create_verification');
describe('Lib create_verification', function () {
  describe('create verify string for returnValue assumption', function () {
    it('simple assumption', function () {
      var expected = 'verify("name").canHandle("func").withArgs("arg1", "arg2").andReturns("value").on(sut));';
      var assumption = {
        name: 'name',
        func: 'func',
        args: stringify(['arg1', 'arg2']),
        action: 'r:\"value\"'
      };
      expect(createVerification(assumption)).to.eql(expected);
    });
    it('complex assumption', function () {
      var expected = 'verify("name").canHandle("func").withArgs(5, {"key":"value"}).andReturns({"foo":"bar"}).on(sut));';
      var assumption = {
        name: 'name',
        func: 'func',
        args: stringify([5, {key: 'value'}]),
        action: 'r:' + stringify({foo: 'bar'})
      };
      expect(createVerification(assumption)).to.eql(expected);
    });
  });

  it('create verify string for callback assumption', function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg1", callback).andCallsCallbackWith("value").on(sut, function () {}));';
    var assumption = {
      name: 'name',
      func: 'func',
      args: stringify(['arg1', function () {}]),
      action: 'cb:1->["value"]'
    };
    expect(createVerification(assumption)).to.eql(expected);
  });

  it('create verify string for throw Error assumption', function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg").andThrowsError("message").on(sut));';
    var assumption = {
      name: 'name',
      func: 'func',
      args: stringify(['arg']),
      action: 'ex:message'
    };
    expect(createVerification(assumption)).to.eql(expected);
  });
});
