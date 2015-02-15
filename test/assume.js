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
  "Given canHandle assumption with return value it should return the value when function is called" : {
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
    },
    "return value is null" : function () {
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').andReturn(null);
      assert.equals(lib.anyFuncName(), null);
    },
    "return value is an object" : function () {
      var lib = chadodouble("lib");
      assume(lib).canHandle('anyFuncName').andReturn({prop1: "value1", prop2: 4});
      assert.equals(lib.anyFuncName(), {prop1: "value1", prop2: 4});
    }
  },
  "Given canHandle assumption with arguments and which returns a simple value" : {
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
      assume(lib).canHandle('anotherFunc').andReturn('foo');
      assert(repo.mylib.anyFunc['["aString"]'].anyString);
      assert(repo.mylib.anotherFunc.undefined.foo);
    },
    "stores who calls the assumption in repo" : function () {
      var lib = chadodouble("mylib");
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturn('anyString');
      lib.anyFunc('aString');
      assert(repo.mylib.anyFunc['["aString"]'].anyString.calledBy);
    } 
  },
  "Given canHandle assumption with object as return value" : {
    "should return the object" : function () {
      var lib = chadodouble("mylib");
      var returnValue = {
        name : "addOneCalculator",
        addOne : function(x) {
          return x + 1;
        }
      }
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturn(returnValue);
      var actualValue = lib.anyFunc('aString');
      assert.equals(actualValue.name, "addOneCalculator");
      assert.equals(actualValue.addOne(1), 2);
    }
  },
  "Given canHandle assumption with a callback" : {
    "should call the callback asynchronous" : function (done) {
      var lib = chadodouble("mylib");
      var cb = function() {
        assert(true);
        done();
      };
      assume(lib).canHandle('anyFunc').withArgs(cb).andCallsCallbackWith("");
      lib.anyFunc(cb);
    },
    "should call the first function as argument" : function (done) {
      var lib = chadodouble("mylib");
      var cb = function() {
        assert(true);
        done();
      };
      var anyNumber = 5;
      assume(lib).canHandle('anyFunc').withArgs("anyArg", anyNumber, cb).andCallsCallbackWith("");
      lib.anyFunc("anyArg", anyNumber, cb);
    },
    "should return control flow and then call callback" : function (done) {
      var lib = chadodouble("mylib");
      var value = "value before";
      var cb = function() {
        assert.equals("changed after function call", value);
        done();
      };
      assume(lib).canHandle('anyFunc').withArgs(cb).andCallsCallbackWith("");
      lib.anyFunc(cb);
      value = "changed after function call";
    },
    "should return returnValue and then call callback" : function (done) {
      var lib = chadodouble("mylib");
      var cb = function() {
        assert(true);
        done();
      };
      var anyNumber = 5;
      assume(lib).canHandle('anyFunc').withArgs("anyArg", anyNumber, cb).andCallsCallbackWith("").andReturn(5);
      assert.equals(5, lib.anyFunc("anyArg", anyNumber, cb));
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
