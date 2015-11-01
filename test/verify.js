'use strict';

var expect = require('must');
var chado = require('../lib/chado');

var repo = {};
var verify = require('../lib/verify')(repo);

describe('Library "verify"', function () {
  var collaborator = {
    funcName: function () {
      return 'value';
    },
    arrayReturner: function () {
      return ['value1', 'value2'];
    },
    callbackFunc: function (foo, callback) {
      callback('value');
    },
    errorFunc: function () {
      throw new Error('any message');
    }
  };

  describe('Handles return values and arguments', function () {
    it('is quiet if the collaborator supports the protocol', function () {
      verify('collie').canHandle('funcName').andReturns('value').on(collaborator);
    });

    it('can return arrays', function () {
      verify('collie').canHandle('arrayReturner').andReturns(['value1', 'value2']).on(collaborator);
    });

    it('throws error, if the sut cannot handle the assumption', function () {
      function func() {
        verify('collie').canHandle('funcName').andReturns('anotherValue').on(collaborator);
      };
      
      expect(func).to.throw();
    });

    it('throws error, if the sut has not the expected function', function () {
      function func() {
        verify('collie').canHandle('funcNameNonExisting').andReturns('value').on(collaborator);
      };
      
      expect(func).to.throw();
    });
  });

  describe('Handles callback assumptions', function () {
    it('calls a callback as requested', function (done) {
      verify('collie').canHandle('callbackFunc').withArgs('foo', chado.callback)
        .andCallsCallbackWith('value')
        .on(collaborator, done);
    });

    it('should throw error, if the sut calls the callback with other argument than expected', function () {
      function func() {
        verify('collie').canHandle('callbackFunc').withArgs('foo', chado.callback, 'bar')
          .andCallsCallbackWith('anothervalue')
          .on(collaborator, 'some dummy arg');
      };
      expect(func).to.throw();
    });

    it('should throw error, when no callback is passed', function () {
      function func() {
        verify('collie').canHandle('callbackFunc').withArgs('foo')
          .andCallsCallbackWith('bar')
          .on(collaborator, function () {});
      };
      expect(func).to.throw();
    });
  });

  describe('Handles Error assumptions', function () {
    it('is quiet if the expected Error is raised', function () {
      verify('collie').canHandle('errorFunc').withArgs('anyArg').andThrowsError('any message').on(collaborator);
    });

    it('throws an error, if the sut doesn\'t throw an error', function () {
      function func() {
        verify('collie').canHandle('funcName').withArgs('anyArg').andThrowsError('any message').on(collaborator);
      };
      expect(func).to.throw();
    });
  });
  
  describe('Storing Verifications', function() {
    it('for return values', function () {
      verify('collie').canHandle('funcName').withArgs('anyString').andReturns('value').on(collaborator);
      expect(repo.collie.funcName['["anyString"]']['r:"value"']).to.exist();
    });

    it('for callback verification', function (done) {
      verify('collie').canHandle('callbackFunc').withArgs('foo', chado.callback)
        .andCallsCallbackWith('value')
        .on(collaborator, function () {
              expect(repo.collie.callbackFunc['["foo","=>function"]']['cb:1->["value"]']).to.exist();
              done();
            });
    });
    
    it('for error verification', function () {
      verify('collie').canHandle('errorFunc').withArgs('anyArg').andThrowsError('any message').on(collaborator);
      expect(repo.collie.errorFunc['["anyArg"]']['ex:any message']).to.exist();
    });
  });
});
