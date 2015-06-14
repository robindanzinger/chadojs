var expect = require('must');
var chadodouble =  require('../lib/testdouble').createTestDoubleFor;
var callback = require('../lib/types').callback;
describe('library assume', function () {
  var repo;
  var assume;
  before(function () {
    repo = {};
    assume = require('../lib/assume')(repo);
  }),
  describe('Given canHandle assumption with return value it should return the value when function is called', function () {
    it('return value is a string', function () {
      expectedString = 'anyString';
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').andReturns('anyString');
      expect(lib.anyFuncName()).eql(expectedString);
    }),
    it('return value is a number', function () {
      expectedNumber = 5;
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').andReturns(5);
      expect(lib.anyFuncName()).eql(expectedNumber);
    }),
    it('return value is null', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').andReturns(null);
      expect(lib.anyFuncName()).eql(null);
    }),
    it('return value is an object', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').andReturns({prop1: 'value1', prop2: 4});
      expect(lib.anyFuncName()).eql({prop1: 'value1', prop2: 4});
    })
  }),
  describe('Given canHandle assumption with arguments and which returns a simple value', function () {
    it('when called with expected arguments it should return value', function () {
      expectedString = 'anyString';
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturns('anyString');
      expect(lib.anyFuncName('aString', [1,2])).eql(expectedString);
    }),
    it('when called with no arguments it should throw error', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturns('anyString');
      var func = function () {
        lib.anyFuncName();
      };
      expect(func).throw();
    }),
    it('when called with wrong argument it should throw error', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').withArgs('aString', [1,2]).andReturns('anyString');
      var func = function () {
        lib.anyFuncName('anotherString', [1,2]);
      };
      expect(func).throw();
    }),
    it('tracks the assumption call', function () {
      var lib = chadodouble('lib');
      var trackInfo = assume(lib).canHandle('anyFuncName').withArgs('aString').andReturns('anyString');
      expect(Object.keys(repo.lib.anyFuncName['["aString"]']['r:"anyString"'].assume)[0]).match('assume.js');
    }),
    it('stores the assumption in repo', function () {
      var lib = chadodouble('mylib');
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      assume(lib).canHandle('anotherFunc').andReturns('foo');
      expect(repo.mylib.anyFunc['["aString"]']['r:"anyString"']).exist();
      expect(repo.mylib.anotherFunc.undefined['r:"foo"']).exist();
    }),
    it('stores who calls the assumption in repo', function () {
      var lib = chadodouble('mylib');
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      lib.anyFunc('aString');
      expect(repo.mylib.anyFunc['["aString"]']['r:"anyString"'].calledBy).exist();
    })
  }),
  describe('Given canHandle assumption with object as return value', function () {
    it('should return the object', function () {
      var lib = chadodouble('mylib');
      var returnValue = {
        name : 'addOneCalculator',
        addOne : function(x) {
          return x + 1;
        }
      }
      assume(lib).canHandle('anyFunc').withArgs('aString').andReturns(returnValue);
      var actualValue = lib.anyFunc('aString');
      expect(actualValue.name).eql('addOneCalculator');
      expect(actualValue.addOne(1)).eql(2);
    })
  }),
  describe('Given canHandle assumption with a callback', function () {
    it('should call the callback asynchronous', function (done) {
      var lib = chadodouble('mylib');
      var cb = function(result) {
        expect(result).eql('value');
        done();
      };
      assume(lib).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith('value');
      lib.anyFunc(cb);
    }),
    it('the first argument of andCallsCallbackWith defines which argument should be used as callback', function (done) {
      var lib = chadodouble('mylib');
      var anotherCb = function () {};
      var cb = function() {
        done();
      };
      assume(lib).canHandle('anyFunc').withArgs('anyArg', anotherCb, callback).andCallsCallbackWith('');
      lib.anyFunc('anyArg', anotherCb, cb);
    }),
    it('should return control flow and then call callback', function (done) {
      var lib = chadodouble('mylib');
      var value = 'value before';
      var cb = function() {
        expect('changed after function call').eql(value);
        done();
      };
      assume(lib).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith('');
      lib.anyFunc(cb);
      value = 'changed after function call';
    }),
    it('should return returnValue and then call callback', function (done) {
      var lib = chadodouble('mylib');
      var cb = function() {
        done();
      };
      var anyNumber = 5;
      assume(lib).canHandle('anyFunc').withArgs('anyArg', anyNumber, callback).andCallsCallbackWith('').andReturns(5);
      expect(lib.anyFunc('anyArg', anyNumber, cb)).equal(5);
    }),
    it('should call callback with no argument if not defined', function (done) {
      var lib = chadodouble('mylib');
      var cb = function() {
        done();
      };
      assume(lib).canHandle('func').withArgs(callback).andCallsCallbackWith();
      lib.func(cb);
    })
  }),
  describe('Given two CanHandle assumptions with different arguments', function () {
    it('depending on the argument it should return the correspondent value', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFuncName').withArgs('arg1').andReturns('val1');
      assume(lib).canHandle('anyFuncName').withArgs('arg2').andReturns('val2');
      expect(lib.anyFuncName('arg1')).eql('val1');
      expect(lib.anyFuncName('arg2')).eql('val2');
    })
  }),
  describe('Given throwError assumption', function () {
    it('should throw an error when called', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFunc').withArgs('anyArg').andThrowsError('my error message');
      var func = function () {
        lib.anyFunc('anyArg');
      };
      expect(func).throw('my error message');
    })
  })
})
