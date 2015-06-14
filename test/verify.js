var expect = require('must');
var chado = require('../lib/chado');
describe('library verify', function () {
  var repo;
  var verify;
  before(function () {
    repo = {};
    verify = require('../lib/verify')(repo);
  }),
  describe('Given canHandle verification', function () {
    it('doesn\'t throw an error if the sut can handle a assumption and returns the assumed value', function () {
      var lib = {
        funcName : function () {
          return "value";
        }
      };
      verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
    }),
    it('throws error, if the sut cannot handle the assumption', function () {
      var lib = {
        funcName : function () {
          return "anotherValue";
        }
      };
      var func = function () {
        verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
      };
      expect(func).throw();
    }),
    it('throws error, if the sut has not the expected function', function () {
      var func = function () {
        var lib = {};
        verify("libName").canHandle("funcName").withArgs("anyString", [1,2]).andReturns("value").on(lib);
      };
      expect(func).throw();
    }),
    it('stores the verification', function () {
      var lib = {funcName : function() {return "value"}};
      verify("libName").canHandle("funcName").withArgs("anyString").andReturns("value").on(lib);
      expect(repo.libName.funcName['["anyString"]']['r:"value"']).exist();
    }),
    it('can return arrays', function () {
      var lib = {
        funcName : function () {
          return ["value1","value2"];
        }
      };
      verify("libName").canHandle("funcName").andReturns(["value1", "value2"]).on(lib);
    })
  }),
  describe('Given callback assumption', function () {
    it('should call the given callback of method on, if the sut can handle the assumption and calls the callback', function (done) {
      var lib = {
        funcName : function (foo, callback, bar) {
          setTimeout(function() {
            callback("value");
          }, 0);
        }
      };
      verify("libName").canHandle("funcName").withArgs("foo", chado.callback, "bar")
        .andCallsCallbackWith("value")
        .on(lib, function() {
          done();
        });
    }),
    it('should throw error, if the sut calls the callback with other argument than expected', function () {
      var lib = {
        funcName : function (foo, callback, bar) {
          setTimeout(function() {
            callback("anothervalue");
          }, 0);
        }
      };
      var func = function () {
        verify("libName").canHandle("funcName").withArgs("foo", chado.callback, "bar")
          .andCallsCallbackWith("value")
          .on(lib, done);
      };
      expect(func).throw();
    }),
    it('stores the verification', function (done) {
      var lib = {
        funcName : function (callback) {
          setTimeout(function() {
            callback("value");
          }, 0);
        }
      };
      verify("libName").canHandle("funcName").withArgs(chado.callback)
        .andCallsCallbackWith("value")
        .on(lib, function() {
          expect(repo.libName.funcName['["=>function"]']['cb:0->["value"]']).exist();
          done();
        });
    }),
    it('should throw error, when no callback is passed', function () {
      var lib = {funcName: function() {}};
      var func = function () {
        verify("libName").canHandle("funcName").withArgs("foo")
          .andCallsCallbackWith("bar")
          .on(lib, function () {});
      };
      expect(func).throw();
    })
  }),
  describe('Given throw Error assumption', function () {
    it('doesn\'t throw an error, if the sut can handle the assumption and throws an error', function () {
      var lib = {
        funcName : function () {
           throw Error("any message");
        }
      };
      verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
    }),
    it('throws an error, if the sut doesn\'t throw an error', function () {
      var lib = {
        funcName : function () {}
      };
      var func = function () {
        verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
      };
      expect(func).throw();
    }),
    it('stores the verification', function () {
     var lib = {funcName : function() {throw Error("any message")}};
     verify("libName").canHandle("funcName").withArgs("anyArg").andThrowsError("any message").on(lib);
     expect(repo.libName.funcName['["anyArg"]']['ex:any message']).exist();
    })
  })
});
