var buster = require('buster');
var assert = buster.assert;
var testDoubleLib;
buster.testCase("Library testdouble", { 
  setUp : function () {
    testDoubleLib = require('../lib/testdouble')();
  },
  "Given: function createTestDoubleFor" : {
    setUp : function () {
      this.createTestDoubleFor = testDoubleLib.createTestDoubleFor;
    },
    "should contain function 'create'" : function () {
      assert.isFunction(this.createTestDoubleFor);
    },
    "should throw error, if called without lib name" : function () {
      var createTestDoubleFor = testDoubleLib.createTestDoubleFor;
      assert.exception(function () {
        createTestDoubleFor();
      });
    },
    "should throw error, if lib is no string" : function () {
      var createTestDoubleFor = testDoubleLib.createTestDoubleFor;
      assert.exception(function () {
        createTestDoubleFor({});
      });
    },
    "should return object, which can be used as testDouble, when called" : function () {
      assert.isObject(this.createTestDoubleFor("anyLib"));
    }
  },
  "Given: function getLibFor And: testDouble" : {
    setUp : function () {
      this.getLibNameFor = testDoubleLib.getLibNameFor;
      this.testDouble = testDoubleLib.createTestDoubleFor("anyLib");
      testDoubleLib.createTestDoubleFor("anotherLib");
    },
    "should throw error, if called with no testDouble" : function () {
      var getLibNameFor = this.getLibNameFor;
      assert.exception(function () {
        getLibNameFor();
      });
    },
    "should return library name, when called with testDouble" : function () {
      assert.equals(this.getLibNameFor(this.testDouble), "anyLib");
    },
    "should throw error, if test double is not stored" : function () {
      var getLibNameFor = this.getLibNameFor;
      assert.exception(function () {
        getLibNameFor({});
      });
    }
  }
});
