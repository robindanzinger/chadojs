var buster = require('buster');
var assert = buster.assert;
var testdoubleRepo = require('../lib/testdouble')();
var chadodouble = testdoubleRepo.createTestDoubleFor;
var repo;
var assume;
buster.testCase("library assume", {
  setUp : function () {
    repo = {};
    assume = require('../lib/assume')(repo, testdoubleRepo);
  },
  "Given CanHandle assumption with return value it should return the value when function is called" : {
    "return value is a string" : function () {
      expectedString = 'anyString';
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').andReturn('anyString');
      assert.equals(lib.anyFuncName(), expectedString);
    },
    "return value is a number" : function () {
      expectedNumber = 5;
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').andReturn(5);
      assert.equals(lib.anyFuncName(), expectedNumber);
    }
  },
  "Given CanHandle assumption with function arguments and return a simple value" : {
    "when called with expected arguments it should return value" : function () {
      expectedString = 'anyString';
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.equals(lib.anyFuncName('aString', [1,2]), expectedString);
    },
    "when called with no arguments it should throw error" : function () {
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.exception(function () {
        lib.anyFuncName();
      });
    },
    "when called with wrong argument it should throw error" : function () {
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturn('anyString');
      assert.exception(function () {
        lib.anyFuncName('anotherString', [1,2]);
      });
    },
    "tracks the assumption call" : function () {
      var lib = chadodouble("lib");
      var trackInfo = assume(lib).canHandle('anyFuncName').withArgs('aString').andReturn('anyString');
      assert(parseInt(trackInfo.line) > 0);
    },
    "stores the assumption in repo" : function () {
      var lib = chadodouble("mylib");
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturn('anyString');
      console.log(repo.mylib.anyFunc);
      assert(repo.mylib.anyFunc['["aString"]'].anyString);
    }
  },
  "Given two CanHandle assumptions with different arguments" : {
    "depending on the argument it should return the correspondent value" : function () {
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').withArgs('arg1').andReturn('val1');
      assume(lib).canHandle('anyFuncName').withArgs('arg2').andReturn('val2');
      assert.equals(lib.anyFuncName('arg1'), 'val1');
      assert.equals(lib.anyFuncName('arg2'), 'val2');
    }
  }
})
