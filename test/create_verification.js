'use strict';

var expect = require('must');
var stringify = require('../lib/stringify').stringify;
var createVerification = require('../lib/create_verification');
var createVerificationString = createVerification.createVerificationString;
var createVerificationMethod = createVerification.createVerificationMethod;
describe('Lib create_verification', function () {
  describe('create verification string', function () {
    describe('create verify string for returnValue assumption', function () {
      it('simple assumption', function () {
        var expected = 'verify(\'name\').canHandle(\'func\').withArgs("arg1", "arg2").andReturns("value").on(sut));';
        var assumption = {
          name: 'name',
          func: 'func',
          args: stringify(['arg1', 'arg2']),
          action: 'r:"value"'
        };
        expect(createVerificationString(assumption)).to.eql(expected);
      });
      it('complex assumption', function () {
        var expected = 'verify(\'name\').canHandle(\'func\').withArgs(5, {"key":"value"}).andReturns({"foo":"bar","func":function () {}}).on(sut));';
        var foo = function () {return 'foo'; };
        var assumption = {
          name: 'name',
          func: 'func',
          args: stringify([5, {key: 'value'}]),
          action: 'r:' + stringify({foo: 'bar', func: foo})
        };
        expect(createVerificationString(assumption)).to.eql(expected);
      });
    });
  
    it('create verify string for callback assumption', function () {
      var expected = 'verify(\'name\').canHandle(\'func\').withArgs("arg1", callback).andCallsCallbackWith("value").on(sut, function () {}));';
      var assumption = {
        name: 'name',
        func: 'func',
        args: stringify(['arg1', function () {}]),
        action: 'cb:1->["value"]'
      };
      expect(createVerificationString(assumption)).to.eql(expected);
    });
  
    it('create verify string for throw Error assumption', function () {
      var expected = 'verify(\'name\').canHandle(\'func\').withArgs("arg").andThrowsError(\'message\').on(sut));';
      var assumption = {
        name: 'name',
        func: 'func',
        args: stringify(['arg']),
        action: 'ex:message'
      };
      expect(createVerificationString(assumption)).to.eql(expected);
    });
  });
  describe('create verification method', function () {
    it('creates a method skeleton', function () {
     var assumption = {
       name: 'name',
       func: 'func',
       args: stringify(['arg']),
       action: 'r:\"value\"'
     };
     var template = {
       returnValue: {
        m0: 'describe(\'{name}\'), function () {',
        m0end: '});',
        m1: 'it(\'{func} called with {args} should return {action.value}\'), function () {',
        m1end: '});'
       }
     };
     var expectedMethodString = 'describe(\'name\'), function () {\n'
      + '  it(\'func called with (arg) should return \"value\"\'), function () {\n'
      + '    verify(\'name\').canHandle(\'func\').withArgs("arg").andReturns("value").on(sut));\n'
      + '  });\n'
      + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.eql(expectedMethodString);
    });
   it('can work with different templates', function () {
     var assumption = {
       name: 'name',
       func: 'func',
       args: stringify(['arg']),
       action: 'r:\"value\"'
     };
     var template = {
       returnValue: {
        m0: 'describe(\'{name}\'), function () {',
        m0end: '});',
        m1: 'describe(\'{func}\'), function () {',
        m1end: '});',
        m2: 'it(\'called with {args} should return {action.value}\'), function () {',
        m2end: '});'
       }
     };
     var expectedMethodString = 'describe(\'name\'), function () {\n'
      + '  describe(\'func\'), function () {\n'
      + '    it(\'called with (arg) should return \"value\"\'), function () {\n'
      + '      verify(\'name\').canHandle(\'func\').withArgs("arg").andReturns("value").on(sut));\n'
      + '    });\n'
      + '  });\n'
      + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.eql(expectedMethodString);
    });
    it('should work with an throwErrorAssumption', function () {
      var assumption = {
        name: 'name',
        func: 'func',
        args: stringify(['arg']),
        action: 'ex:message'
      };
      var template = {
         throwError: {
         m0: 'describe(\'{name}\'), function () {',
         m0end: '});',
         m1: 'it(\'called with {args} should throw error\'), function () {',
         m1end: '});'
        }
      };
      var expectedMethodString = 
         'describe(\'name\'), function () {\n'
       + '  it(\'called with (arg) should throw error\'), function () {\n'
       + '    verify(\'name\').canHandle(\'func\').withArgs("arg").andThrowsError(\'message\').on(sut));\n'
       + '  });\n'
       + '});\n';
       var actualMethodString = createVerificationMethod(template, assumption);
       expect(actualMethodString).to.eql(expectedMethodString);
    });
  });
});
