var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var verify = require('../lib/verify').verify;
buster.testCase("library verify", {
  "Given a CanHandle verification" : {
    "returns true, if the sut can handle the assumption" : function () {
      var lib = {
        funcName : function () {
          return "value";
        }
      };
      assert(verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturn("value").on(lib));
    },
    "returns false, if the sut cannot handle the assumption" : function () {
      var lib = {
        funcName : function () {
          return "anotherValue";
        }
      };
      refute(verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturn("value").on(lib));
    },
    "throws error, if the sut has not the expected function" : function () {
      assert.exception(function () {
        var lib = {};
        (verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturn("value").on(lib));
      });
    }
  }
})
