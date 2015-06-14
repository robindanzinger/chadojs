var expect = require('must');
var stringify = require('../lib/stringify').stringify;
var parse = require('../lib/stringify').parse;

describe('Test stringify', function () {
  it('stringifies data like JSON', function () {
    expect(stringify("5")).equal('"5"');
    expect(stringify(5)).equal("5");
    expect(stringify("value")).equal('"value"');
  }),
  it('stringifies object like JSON', function () {
    var obj = {key1:"value1", key2:2, key3:3.15};
    var expected = '{"key1":"value1","key2":2,"key3":3.15}';
    expect(stringify(obj)).equal(expected);
  }),
  it('stringifies arrays like JSON', function () {
    var array = [5,"value","anotherValue"];
    var expected = '[5,"value","anotherValue"]';
    expect(stringify(array)).equal(expected);
  }),
  it('stringifies functions as \'=>function\' string', function () {
    var func = function () {};
    expect(stringify(func)).equal('"=>function"'); 
  }),
  it('escapes string =>function', function () {
    expect(stringify("=>function")).equal('"/=>function"');
    expect(stringify("/=>function")).equal('"//=>function"');
    expect(stringify("foo=>function")).equal('"foo=>function"');
  }),
  it('object with functions and strings', function () {
    var obj = {
      key: function (param) {return param + 1}, 
      anotherKey:"=>function"
    };
    var expected = '{"key":"=>function","anotherKey":"/=>function"}';
    expect(stringify(obj)).equal(expected);
  })
});

describe('Test parse', function () {
  it('parses like JSON', function () {
    expect(parse('"5"')).equal("5");
    expect(parse('5')).equal(5);
  }),
  it('parses =>function to anyFunction', function () {
    expect(parse('"=>function"')).to.be.function();
//    expect(parse('"=>function"').toString()).equal("function () {}");
  }),
  it('unescapes /=>function to =>function', function () {
    expect(parse('"/=>function"')).equal('=>function');
    expect(parse('"//=>function"')).equal('/=>function');
    expect(stringify("foo/=>function")).equal('"foo/=>function"');
  }),
  it('parses object with function', function () {
    var str = '{"key":"=>function","anotherKey":"/=>function"}';
    var obj = parse(str);
    expect(obj.anotherKey).equal("=>function");
    expect(obj.key).to.be.function();
  })
});



