'use strict';

var expect = require('must');
var stringify = require('../lib/stringify').stringify;
var parse = require('../lib/stringify').parse;

describe('Library "stringify"', function () {
  describe('stringifies', function () {
    it('data like JSON', function () {
      expect(stringify('5')).to.be('"5"');
      expect(stringify(5)).to.be('5');
      expect(stringify('value')).to.be('"value"');
    });

    it('object like JSON', function () {
      var obj = {key1: 'value1', key2: 2, key3: 3.15};
      var expected = '{"key1":"value1","key2":2,"key3":3.15}';
      expect(stringify(obj)).to.be(expected);
    });

    it('arrays like JSON', function () {
      var array = [5, 'value', 'anotherValue'];
      var expected = '[5,"value","anotherValue"]';
      expect(stringify(array)).to.be(expected);
    });

    it('functions as \'=>function\' string', function () {
      function func() {};
      expect(stringify(func)).to.be('"=>function"');
    });

    it('with escaping string =>function', function () {
      expect(stringify('=>function')).to.be('"/=>function"');
      expect(stringify('/=>function')).to.be('"//=>function"');
      expect(stringify('foo=>function')).to.be('"foo=>function"');
    });

    it('an object with functions and strings', function () {
      var obj = {
        key: function (param) { return param + 1; },
        anotherKey: '=>function'
      };
      var expected = '{"key":"=>function","anotherKey":"/=>function"}';
      expect(stringify(obj)).to.be(expected);
    });
  });
  
  describe('parses', function () {
    it('like JSON', function () {
      expect(parse('"5"')).to.be('5');
      expect(parse('5')).to.be(5);
    });

    it('"=>function" to anyFunction', function () {
      expect(parse('"=>function"')).to.be.function();
      expect(parse('"=>function"').toString()).to.match(/function.*\(\).*\{.*\}/);
    });

    it('with unescaping /=>function to =>function', function () {
      expect(parse('"/=>function"')).to.be('=>function');
      expect(parse('"//=>function"')).to.be('/=>function');
      expect(stringify('foo/=>function')).to.be('"foo/=>function"');
    });

    it('an object with function', function () {
      var obj = parse('{"key":"=>function","anotherKey":"/=>function"}');
      expect(obj.anotherKey).to.be('=>function');
      expect(obj.key).to.be.function();
    });
  });



});

