var buster = require('buster');
var assert = buster.assert;
var assume = require('../lib/assume')();
buster.testCase("library assume", {
  "Given CanHandle assumption with return value it should return the value when function is called" : {
    "return value is a string" : function () {
      expectedString = 'anyString';
      var lib = {};
      assume(lib).canHandle('anyFuncName').andReturn('anyString');
      assert.equals(lib.anyFuncName(), expectedString);
    },
    "return value is a number" : function () {
      expectedNumber = 5;
      var lib = {};
      assume(lib).canHandle('anyFuncName').andReturn(5);
      assert.equals(lib.anyFuncName(), expectedNumber);
    }
  },
  "Given CanHandle assumption with function arguments and return a simple value" : {
    "when called with expected arguments it should return value" : function () {
      expectedString = 'anyString';
      var lib = {};
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.equals(lib.anyFuncName('aString', [1,2]), expectedString);
    },
    "when called with no arguments it should throw error" : function () {
      var lib = {};
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.exception(function () {
        lib.anyFuncName();
      });
    },
    "when called with wrong argument it should throw error" : function () {
      var lib = {};
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.exception(function () {
        lib.anyFuncName('anotherString', [1,2]);
      });
    },
    "tracks the assumption call" : function () {
      var lib = {};
      var trackInfo = assume(lib).canHandle('anyFuncName').withArgs('aString').andReturn('anyString');
      assert.equals(trackInfo.line, "42");
    }
  },
  "Given two CanHandle assumptions with different arguments" : {
    "depending on the argument it should return the correspondent value" : function () {
      var lib = {};
      assume(lib).canHandle('anyFuncName').withArgs('arg1').andReturn('val1');
      assume(lib).canHandle('anyFuncName').withArgs('arg2').andReturn('val2');
      assert.equals(lib.anyFuncName('arg1'), 'val1');
      assert.equals(lib.anyFuncName('arg2'), 'val2');
    }
  }
})
