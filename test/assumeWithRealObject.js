'use strict';

var expect = require('must');
var callback = require('../lib/types').callback;
var chado = require('../lib/chado').create();
var chadodouble = chado.createDouble;
var assume = chado.assume;
var repo = chado.repo;
var realObject = {anyFuncName: function () { return 'Ooops'; }};
var collaborator;

describe('library assume [on real objects]', function () {
  beforeEach(function () {
    collaborator = chadodouble('collie', realObject);
  });

  afterEach(function () {
    chado.reset();
  });

  describe('Mocking a function on an existing object', function () {
    it('returns the mocked value', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns('anyString');
      expect(realObject.anyFuncName()).to.eql('anyString');
    });

    it('returns a null value', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns(null);
      expect(realObject.anyFuncName()).to.eql(null);
    });

    it('respects expected arguments', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      expect(realObject.anyFuncName('aString', [1, 2])).to.eql('anyString');
    });

    it('calls a configured callback asynchronous', function (done) {
      var cb = function (result) {
        expect(result).to.eql('value');
        done();
      };
      assume(collaborator).canHandle('anyFuncName').withArgs(callback).andCallsCallbackWith('value');
      realObject.anyFuncName(cb);
    });

    it('throws error if called with wrong number of args', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      var func = function () {
        realObject.anyFuncName();
      };
      expect(func).to.throw();
    });

    it('throws error if called with wrong args', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString', [1, 2]).andReturns('anyString');
      var func = function () {
        realObject.anyFuncName('aString', [1, 3]);
      };
      expect(func).to.throw();
    });

  });

  describe('Although working on real object the repo keeps track of', function () {

    it('the assumption call', function () {
      assume(collaborator).canHandle('anyFuncName').withArgs('aString').andReturns('anyString');

      expect(Object.keys(repo.collie.anyFuncName['["aString"]']['r:"anyString"'].assume)[0]).to.match('assumeWithRealObject.js');
    });

    it('the assumptions in repo', function () {
      assume(collaborator).canHandle('anyFunc').withArgs('aString').andReturns('anyString');
      assume(collaborator).canHandle('anotherFunc').andReturns('foo');

      expect(repo.collie.anyFunc['["aString"]']['r:"anyString"']).to.exist();
      expect(repo.collie.anotherFunc.undefined['r:"foo"']).to.exist();
    });

    it('the callee in repo', function () {
      assume(collaborator).canHandle('anyFunc').withArgs('aString').andReturns('anyString');

      realObject.anyFunc('aString');
      expect(repo.collie.anyFunc['["aString"]']['r:"anyString"'].calledBy).to.exist();
    });
  });

  describe('Resetting on chado', function () {
    it('restores the old function', function () {
      assume(collaborator).canHandle('anyFuncName').andReturns('anyString');
      chado.reset();
      expect(realObject.anyFuncName()).to.eql('Ooops');
    });
  });
});
