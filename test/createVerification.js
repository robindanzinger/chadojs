var buster = require('buster');
var assert = buster.assert;
var stringify = require('../lib/stringify').stringify;
var parse = require('../lib/stringify').parse;
var createVerification = require('../lib/createVerification');
buster.testCase("Lib createVerification", {
  "create verify string for returnValue assumption" : function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg1", "arg2").andReturn("value").on(sut));';
    var assumption = {
      name: "name",
      func: "func",
      args: stringify(["arg1", "arg2"]),
      action: 'r:"value"'
    };
    assert.equals(expected, createVerification(assumption));
  },
  "create verify string for callback assumption" : function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg1", "=>function").andCallsCallbackWith(1, "value").on(sut, function (result) {}));';
    var assumption = {
      name: "name",
      func: "func",
      args: stringify(["arg1", function(){}]),
      action: 'cb:1->["value"]'
    };
    assert.equals(expected, createVerification(assumption));
  },
 "create verify string for throw Error assumption" : function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg").andThrowError("message").on(sut));';
    var assumption = {
      name: "name",
      func: "func",
      args: stringify(["arg"]), 
      action: 'ex:message'
    };
    assert.equals(expected, createVerification(assumption));
  }
});
