'use strict';
var expect = require('must');
var callback = require('../lib/types').callback;

var stub = require('../lib/stub');

describe('library "stub"', function () {
  var collaborator;

  beforeEach(function () {
    collaborator = require('../lib/testdouble').createDouble('collaborator');
  });

  describe('Calling a stub with defined return value (no args)', function () {
    it('returns a defined string', function () {
      stub(collaborator).canHandle('anyFuncName').andReturns('anyString');

      expect(collaborator.anyFuncName()).to.be('anyString');
    });

    it('returns a defined number', function () {
      stub(collaborator).canHandle('anyFuncName').andReturns(5);

      expect(collaborator.anyFuncName()).to.be(5);
    });

    it('returns a defined "null"', function () {
      stub(collaborator).canHandle('anyFuncName').andReturns(null);

      expect(collaborator.anyFuncName()).to.be(null);
    });

    it('returns a defined object', function () {
      var expectedReturnValue = {prop1: 'value1', prop2: 4};
      stub(collaborator).canHandle('anyFuncName').andReturns(expectedReturnValue);

      expect(collaborator.anyFuncName()).to.be(expectedReturnValue);
    });

    it('can reuse a testdouble function to create another assumption', function () {
      var testdoubleFunc = stub(collaborator).canHandle('anyFunc');
      testdoubleFunc.withArgs(1).andReturns(1);
      testdoubleFunc.withArgs(2).andReturns(2);
      testdoubleFunc.andReturns(0);

      expect(collaborator.anyFunc()).to.be(0);
      expect(collaborator.anyFunc(1)).to.be(1);
      expect(collaborator.anyFunc(2)).to.be(2);
    });

  });

  describe('Calling a stub with defined return value (defined arguments)', function () {
    it('returns the expected value when called with the expected arguments', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      expect(collaborator.anyFuncName('aString', [1, 2])).to.be('anyString');
    });

    it('returns the expected value when called with expected number', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs(1).andReturns('anyString');

      expect(collaborator.anyFuncName(1)).to.be('anyString');
    });

    it('should ignore appending undefined arguments when creating assumption', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs(1, undefined).andReturns('anyString');

      expect(collaborator.anyFuncName(1)).to.be('anyString');
    });

    it('should ignore all appending undefined arguments when calling the stubd function', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs(1).andReturns('anyString');

      expect(collaborator.anyFuncName(1, undefined)).to.be('anyString');
    });

    it('returns a working object', function () {
      var returnValue = {
        name: 'addOneCalculator',
        addOne: function (x) {
          return x + 1;
        }
      };
      stub(collaborator).canHandle('anyFunc').withArgs('aString').andReturns(returnValue);

      var actualValue = collaborator.anyFunc('aString');
      expect(actualValue.name).to.eql('addOneCalculator');
      expect(actualValue.addOne(1)).to.eql(2);
    });

    it('returns the correspondent value to an argument', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs('arg1').andReturns('val1');
      stub(collaborator).canHandle('anyFuncName').withArgs('arg2').andReturns('val2');

      expect(collaborator.anyFuncName('arg1')).to.eql('val1');
      expect(collaborator.anyFuncName('arg2')).to.eql('val2');
    });

    it('throws an error when called with no arguments', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      function func() { collaborator.anyFuncName(); }
      expect(func).to.throw(/There is no assumption defined. /);
    });

    it('throws an error when called with wrong arguments', function () {
      stub(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      function func() { collaborator.anyFuncName('anotherString', [1, 2]); }
      expect(func).to.throw();
    });
  });

  describe('Calling a stub with defined callback', function () {
    it('call the callback asynchronously with an argument', function (done) {
      function cb(result) {
        expect(result).to.be('value');
        done();
      }

      stub(collaborator).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith('value');
      collaborator.anyFunc(cb);
    });

    it('will use the position of the special "callback" argument for execution', function (done) {
      function anotherCb() {}
      function cb() {
        done();
      }

      stub(collaborator).canHandle('anyFunc').withArgs('anyArg', anotherCb, callback).andCallsCallbackWith();
      collaborator.anyFunc('anyArg', anotherCb, cb);
    });

    it('calls the callback after execution of the synchronous flow', function (done) {
      var value = 'value before';
      var cb = function () {
        expect('changed after function call').to.eql(value);
        done();
      };

      stub(collaborator).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith();
      collaborator.anyFunc(cb);
      value = 'changed after function call';
    });

    it('will return the returnValue and then call callback', function (done) {
      var cb = function () {
        done();
      };
      stub(collaborator).canHandle('anyFunc').withArgs('anyArg', callback).andCallsCallbackWith().andReturns(5);

      expect(collaborator.anyFunc('anyArg', cb)).to.be(5);
    });
    it('can define two different callbacks on same function', function (done) {
      var funcDouble = stub(collaborator).canHandle('anyFunc');
      funcDouble.withArgs(callback, 'anyArg').andCallsCallbackWith();
      funcDouble.withArgs('anyArg', callback).andCallsCallbackWith();

      var cb = function () {
        collaborator.anyFunc('anyArg', done);
      };
      collaborator.anyFunc(cb, 'anyArg');
    });
  });

  describe('Calling a stub with defined Error', function () {
    it('throws the error', function () {
      stub(collaborator).canHandle('anyFunc').andThrowsError('my error message');

      expect(collaborator.anyFunc).to.throw('my error message');
    });
  });
});
