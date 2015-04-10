var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var repo;
var verify;
buster.testCase("library verify", {
  setUp : function () {
    repo = {};
    verify = require('../lib/verify')(repo);
  },
  "Given a CanHandle verification" : {
    "returns true, if the sut can handle a assumption and returns the assumed value" : function () {
      var lib = {
        funcName : function () {
          return "value";
        }
      };
      assert(verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturn("value").on(lib));
    },
    "returns true, if the sut can handle the assumption and calls the callback" : function (done) {
      var lib = {
        funcName : function (foo, callback, bar) {
          setTimeout(function() {
            callback("value");
          }, 0);
        }
      };
      var callback = function () {};
      verify("libName").canHandle("funcName").withArgs("foo", callback, "bar")
        .andCallsCallbackWith(1, "value")
        .on(lib, function (result) {
          assert(result);
          done();
        });
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
    },
    "stores the verification" : function () {
      var lib = {funcName : function() {return "value"}};
      verify("libName").canHandle("funcName").withArgs("anyString").andReturn("value").on(lib);
      assert(repo.libName.funcName['["anyString"]']['r:"value"']);
    },
    "can return arrays" : function () {
      var lib = {
        funcName : function () {
          return ["value1","value2"];
        }
      };
      assert(verify("libName").canHandle("funcName").andReturn(["value1", "value2"]).on(lib));
    }
  },
  "Given throw Error assumption" : {
    "returns true, if the sut can handle the assumption and throws an error" : function () {
      var lib = {
        funcName : function () {
           throw Error("any message");
        }
      };
      assert(verify("libName").canHandle("funcName").withArgs("anyArg").andThrowError("any message").on(lib));
    },
    "returns false, if the sut doesn't throw an error" : function () {
      var lib = {
        funcName : function () {}
      };
      refute(verify("libName").canHandle("funcName").withArgs("anyArg").andThrowError("any message").on(lib));
    },
    "stores the verification" : function () {
     var lib = {funcName : function() {throw Error("any message")}};
     verify("libName").canHandle("funcName").withArgs("anyArg").andThrowError("any message").on(lib);
     assert(repo.libName.funcName['["anyArg"]']['ex:any message']);
    }  
  }
})
