var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var stringify = require('../lib/stringify').stringify;
var parse = require('../lib/stringify').parse;

buster.testCase("Test stringify", {
  "stringifies data like JSON" : function () {
    assert.equals('"5"', stringify("5"));
    assert.equals("5", stringify(5));
    assert.equals('"value"', stringify("value"));
  },
  "stringifies object like JSON" : function () {
    var obj = {key1:"value1", key2:2, key3:3.15};
    var expected = '{"key1":"value1","key2":2,"key3":3.15}';
    assert.equals(expected, stringify(obj));
  },
  "stringifies arrays like JSON" : function () {
    var array = [5,"value","anotherValue"];
    var expected = '[5,"value","anotherValue"]';
    assert.equals(expected, stringify(array));
  },
  "stringifies functions as '=>function' string" : function () {
    var func = function () {};
    assert.equals('"=>function"', stringify(func)); 
  },
  "escapes string =>function" : function () {
    assert.equals('"/=>function"', stringify("=>function"));
    assert.equals('"//=>function"', stringify("/=>function"));
    assert.equals('"foo=>function"', stringify("foo=>function"));
  },
  "object with functions and strings" : function () {
    var obj = {
      key: function (param) {return param + 1}, 
      anotherKey:"=>function"
    };
    var expected = '{"key":"=>function","anotherKey":"/=>function"}';
    assert.equals(expected, stringify(obj));
  }
});

buster.testCase("Test parse", {
  "parses like JSON" : function () {
    assert.equals("5", parse('"5"'));
    assert.equals(5, parse('5'));
  },
  "parses =>function to anyFunction" : function () {
    assert(typeof parse('"=>function"') === "function");
    assert.equals("function () {}", parse('"=>function"').toString());
  },
  "unescapes /=>function to =>function" : function () {
    assert.equals('=>function', parse('"/=>function"'));
    assert.equals('/=>function', parse('"//=>function"'));
    assert.equals('"foo/=>function"', stringify("foo/=>function"));
  },
  "parses object with function" : function () {
    var str = '{"key":"=>function","anotherKey":"/=>function"}';
    var obj = parse(str);
    assert.equals("=>function", obj.anotherKey);
    assert(typeof obj.key === 'function');
  }
});



