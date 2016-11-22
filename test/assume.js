'use strict';

var path = require('path');
var expect = require('must');
var callback = require('../lib/types').callback;

var repo = {};
var assume = require('../lib/assume')(repo);

describe('library "assume"', function () {
  var collaborator;

  beforeEach(function () {
    collaborator = require('../lib/testdouble').createDouble('collie');
  });

  describe('Calling a stub with defined return value (no args)', function () {
    it('returns a defined string', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns('anyString');

      expect(collaborator.anyFuncName()).to.be('anyString');
    });

    it('returns a defined number', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns(5);

      expect(collaborator.anyFuncName()).to.be(5);
    });

    it('returns a defined "null"', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns(null);

      expect(collaborator.anyFuncName()).to.be(null);
    });

    it('returns a defined object', function () {
      var expectedReturnValue = {prop1: 'value1', prop2: 4};
      assume(collaborator).canHandle('anyFuncName').andReturns(expectedReturnValue);

      expect(collaborator.anyFuncName()).to.be(expectedReturnValue);
    });

    it('throws an exception if no return value is set up', function () {
      assume(collaborator).canHandle('anyFuncName');
      
      function func() {
        collaborator.anyFuncName();
      }
      expect(func).to.throw(/anyFuncName is not a function/);
    });
  });

  describe('Calling a stub with defined return value (defined arguments)', function () {
    it('returns the expected value when called with the expected arguments', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      expect(collaborator.anyFuncName('aString', [1, 2])).to.be('anyString');
    });

    it('returns the expected value when called with expected number', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs(1).andReturns('anyString');

      expect(collaborator.anyFuncName(1)).to.be('anyString');
    });

    it('should ignore appending undefined arguments when creating assumption', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs(1, undefined).andReturns('anyString');

      expect(collaborator.anyFuncName(1)).to.be('anyString');
    });

    it('should ignore all appending undefined arguments when calling the assumed function', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs(1).andReturns('anyString');

      expect(collaborator.anyFuncName(1, undefined)).to.be('anyString');
    });

    it('returns a working object', function () {
      var returnValue = {
        name: 'addOneCalculator',
        addOne: function (x) {
          return x + 1;
        }
      };
      assume(collaborator).canHandle('anyFunc').withArgs('aString').andReturns(returnValue);

      var actualValue = collaborator.anyFunc('aString');
      expect(actualValue.name).to.eql('addOneCalculator');
      expect(actualValue.addOne(1)).to.eql(2);
    });

    it('returns the correspondent value to an argument', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('arg1').andReturns('val1');
      assume(collaborator).canHandle('anyFuncName').withArgs('arg2').andReturns('val2');

      expect(collaborator.anyFuncName('arg1')).to.eql('val1');
      expect(collaborator.anyFuncName('arg2')).to.eql('val2');
    });

    it('throws an error when called with no arguments', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      function func() { collaborator.anyFuncName(); }
      expect(func).to.throw(/There is no assumption defined. /);
    });

    it('throws an error when called with wrong arguments', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');

      function func() { collaborator.anyFuncName('anotherString', [1, 2]); }
      expect(func).to.throw();
    });
  });

  describe('Storing assumptions', function () {
    it('tracks the assumption call', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString').andReturns('anyString');

      expect(repo.collie.anyFuncName['["aString"]']['r:"anyString"'].assume).to.have.ownProperty(path.join(__dirname, 'assume.js'));
    });

    it('stores each assumption in repo', function () {
      assume(collaborator).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      assume(collaborator).canHandle('anotherFunc').andReturns('foo');

      expect(repo.collie.anyFunc['["aString"]']['r:"anyString"']).to.exist();
      expect(repo.collie.anotherFunc.undefined['r:"foo"']).to.exist();
    });

    it('stores who calls the assumption in repo', function () {
      assume(collaborator).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      collaborator.anyFunc('aString');

      expect(repo.collie.anyFunc['["aString"]']['r:"anyString"'].calledBy).to.exist();
    });
  });

  describe('Calling a stub with defined callback', function () {
    it('call the callback asynchronously with an argument', function (done) {
      function cb(result) {
        expect(result).to.be('value');
        done();
      }

      assume(collaborator).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith('value');
      collaborator.anyFunc(cb);
    });

    it('will use the position of the special "callback" argument for execution', function (done) {
      function anotherCb() {}
      function cb() {
        done();
      }

      assume(collaborator).canHandle('anyFunc').withArgs('anyArg', anotherCb, callback).andCallsCallbackWith();
      collaborator.anyFunc('anyArg', anotherCb, cb);
    });

    it('calls the callback after execution of the synchronous flow', function (done) {
      var value = 'value before';
      var cb = function () {
        expect('changed after function call').to.eql(value);
        done();
      };

      assume(collaborator).canHandle('anyFunc').withArgs(callback).andCallsCallbackWith();
      collaborator.anyFunc(cb);
      value = 'changed after function call';
    });

    it('will return the returnValue and then call callback', function (done) {
      var cb = function () {
        done();
      };
      assume(collaborator).canHandle('anyFunc').withArgs('anyArg', callback).andCallsCallbackWith().andReturns(5);

      expect(collaborator.anyFunc('anyArg', cb)).to.be(5);
    });
  });

  describe('Calling a stub with defined Error', function () {
    it('throws the error', function () {
      assume(collaborator).canHandle('anyFunc').andThrowsError('my error message');

      expect(collaborator.anyFunc).to.throw('my error message');
    });
  });
});
