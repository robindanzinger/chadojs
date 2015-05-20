var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var chado = require('../lib/chado');
var repo;
var verify;
buster.testCase("library verify", {
  setUp : function () {
    repo = {};
    verify = require('../lib/verify')(repo);
  },
  "Given a CanHandle verification" : {
    "doesn't throw an error if the sut can handle a assumption and returns the assumed value" : function () {
      var lib = {
        funcName : function () {
          return "value";
        }
      };
      verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
      assert(true);
    },
    "throws error, if the sut cannot handle the assumption" : function () {
      var lib = {
        funcName : function () {
          return "anotherValue";
        }
      };
      assert.exception(function () {
        verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
      });
    },
    "throws error, if the sut has not the expected function" : function () {
      assert.exception(function () {
        var lib = {};
        verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
      });
    },
    "stores the verification" : function () {
      var lib = {funcName : function() {return "value"}};
      verify("libName").canHandle("funcName").withArgs("anyString").andReturns("value").on(lib);
      assert(repo.libName.funcName['["anyString"]']['r:"value"']);
    },
    "can return arrays" : function () {
      var lib = {
        funcName : function () {
          return ["value1","value2"];
        }
      };
      verify("libName").canHandle("funcName").andReturns(["value1", "value2"]).on(lib);
      assert(true);
    }
  },
  "Given callback assumption" : {
    "returns true, if the sut can handle the assumption and calls the callback" : function (done) {
      var lib = {
        funcName : function (foo, callback, bar) {
          setTimeout(function() {
            callback("value");
          }, 0);
        }
      };
      verify("libName").canHandle("funcName").withArgs("foo", chado.callback, "bar")
        .andCallsCallbackWith("value")
        .on(lib, function (result) {
          assert(result);
          done();
        });
    },
    "should throw error, when no callback is passed" : function () {
      var lib = {funcName: function() {}};
      assert.exception(function () {
        verify("libName").canHandle("funcName").withArgs("foo")
          .andCallsCallbackWith("bar")
          .on(lib, function () {});
      });
    }
  },
  "Given throw Error assumption" : {
    "doesn't throw an error, if the sut can handle the assumption and throws an error" : function () {
      var lib = {
        funcName : function () {
           throw Error("any message");
        }
      };
      verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
      assert(true);
    },
    "throws an error, if the sut doesn't throw an error" : function () {
      var lib = {
        funcName : function () {}
      };
      assert.exception(function () {
        verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
      });
    },
    "stores the verification" : function () {
     var lib = {funcName : function() {throw Error("any message")}};
     verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
     assert(repo.libName.funcName['["anyArg"]']['ex:any message']);
    }  
  }
})
