'use strict';

var expect = require('must');
var chadodouble = require('../lib/testdouble').createTestDoubleFor;
var callback = require('../lib/types').callback;
var chado = require('../lib/chado').create();
var lib = chadodouble('mylib');
var assume = chado.assume;
var repo = chado.repo;
var realObject = {anyFuncName: function () {return 'Ooops';}};

describe('library assume [on real objects]', function () {
  before(function () {
  });

  afterEach(function () {
    chado.reset();
  })

  describe('Mocking a function on an existing object', function () {
    it('returns the mocked value', function () {
      assume(lib, realObject).canHandle('anyFuncName').andReturns('anyString');
      expect(realObject.anyFuncName()).to.eql('anyString');
    });

    it('returns a null value', function () {
      assume(lib, realObject).canHandle('anyFuncName').andReturns(null);
      expect(realObject.anyFuncName()).to.eql(null);
    });

    it('respects expected arguments', function () {
      assume(lib, realObject).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      expect(realObject.anyFuncName('aString', [1, 2])).to.eql('anyString');
    });

    it('calls a configured callback asynchronous', function (done) {
      var cb = function (result) {
        expect(result).to.eql('value');
        done();
      };
      assume(lib, realObject).canHandle('anyFuncName').withArgs(callback).andCallsCallbackWith('value');
      realObject.anyFuncName(cb);
    });

    it('throws error if called with wrong number of args', function () {
      assume(lib, realObject).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      var func = function () {
        realObject.anyFuncName();
      };
      expect(func).to.throw();
    });

    it('throws error if called with wrong args', function () {
      assume(lib, realObject).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      var func = function () {
        realObject.anyFuncName('aString', [1, 3]);
      };
      expect(func).to.throw();
    });

  });

  describe('Although working on real object the repo keeps track of', function () {

    it('the assumption call', function () {
      assume(lib, realObject).canHandle('anyFuncName').withArgs('aString').andReturns('anyString');

      expect(Object.keys(repo.mylib.anyFuncName['["aString"]']['r:"anyString"'].assume)[0]).to.match('assumeWithRealObject.js');
    });

    it('the assumptions in repo', function () {
      assume(lib, realObject).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      assume(lib, realObject).canHandle('anotherFunc').andReturns('foo');

      expect(repo.mylib.anyFunc['["aString"]']['r:"anyString"']).to.exist();
      expect(repo.mylib.anotherFunc.undefined['r:"foo"']).to.exist();
    });

    it('the callee in repo', function () {
      assume(lib, realObject).canHandle('anyFunc').withArgs('aString').andReturns('anyString');

      realObject.anyFunc('aString');
      expect(repo.mylib.anyFunc['["aString"]']['r:"anyString"'].calledBy).to.exist();
    });
  });

  describe('Resetting on chado', function () {
    it('restores the old function', function () {
      assume(lib, realObject).canHandle('anyFuncName').andReturns('anyString');
      chado.reset();
      expect(realObject.anyFuncName()).to.eql('Ooops');
    });
  });

  describe('Given throwError assumption', function () {
    it('should throw an error when called', function () {
      var lib = chadodouble('lib');
      assume(lib).canHandle('anyFunc').withArgs('anyArg').andThrowsError('my error message');
      var func = function () {
        lib.anyFunc('anyArg');
      };
      expect(func).to.throw('my error message');
    });
  });
});