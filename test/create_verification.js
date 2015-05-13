var buster = require('buster');
var assert = buster.assert;
var stringify = require('../lib/stringify').stringify;
var parse = require('../lib/stringify').parse;
var createVerification = require('../lib/create_verification');
buster.testCase("Lib create_verification", {
  "create verify string for returnValue assumption" : function () {
    var expected = 'verify("name").canHandle("func").withArgs("arg1", "arg2").andReturns("value").on(sut));';
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
    var expected = 'verify("name").canHandle("func").withArgs("arg").andThrowsError("message").on(sut));';
    var assumption = {
      name: "name",
      func: "func",
      args: stringify(["arg"]), 
      action: 'ex:message'
    };
    assert.equals(expected, createVerification(assumption));
  }
});
