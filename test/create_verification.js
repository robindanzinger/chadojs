'use strict';

var expect = require('must');
var stringify = require('../lib/stringify').stringify;
var createVerification = require('../lib/create_verification');
var actionStringLib = require('../lib/actionString');
var createVerificationString = createVerification.createVerificationString;
var createVerificationMethod = createVerification.createVerificationMethod;

describe('Lib create_verification', function () {

  describe('create verification string', function () {
    describe('create verify string for returnValue assumption', function () {
      it('simple assumption', function () {
        var expected = 'verify(\'name\').canHandle(\'func\').withArgs("arg1", "arg2").andReturns("value").on(sut));';
        var assumption = createDefaultReturnValueAssumption().withArgs(['arg1', 'arg2']).build();
        expect(createVerificationString(assumption)).to.be(expected);
      });
      it('complex assumption', function () {
        var expected = 'verify(\'name\').canHandle(\'func\').withArgs(5, {"key":"value"}).andReturns({"foo":"bar","func":function () {}}).on(sut));';
        var foo = function () {return 'foo'; };
        var assumption = createDefaultReturnValueAssumption()
          .withArgs([5, {key: 'value'}])
          .withReturnValue({foo: 'bar', func: foo})
          .build();
        expect(createVerificationString(assumption)).to.be(expected);
      });
    });

    it('create verify string for callback assumption', function () {
      var expected = 'verify(\'name\').canHandle(\'func\').withArgs(callback, "arg").andCallsCallbackWith("value").on(sut, function () {}));';
      var assumption = createDefaultCallbackAssumption().build();
      expect(createVerificationString(assumption)).to.be(expected);
    });

    it('create verify string for throw Error assumption', function () {
      var expected = 'verify(\'name\').canHandle(\'func\').withArgs("arg").andThrowsError(\'message\').on(sut));';
      var assumption = createDefaultThrowErrorAssumption().build();
      expect(createVerificationString(assumption)).to.be(expected);
    });
  });

  describe('create verification method', function () {
    var template = {
      returnValue: {
        m0: 'describe(\'{name}\'), function () {',
        m0end: '});',
        m1: 'it(\'{func} called with {args} should return {action.value}\'), function () {',
        m1end: '});'
      },
      throwError: {
        m0: 'describe(\'{name}\'), function () {',
        m0end: '});',
        m1: 'it(\'called with {args} should throw error\'), function () {',
        m1end: '});'
      },
      callback: {
        m0: 'describe(\'{name}\'), function () {',
        m0end: '});',
        m1: 'it(\'{func} called with {args} should call callback with ({action.cbargs})\'), function () {',
        m1end: '});'
      }
    };

    it('creates a method skeleton', function () {
      var assumption = createDefaultReturnValueAssumption().build();
      var expectedMethodString =
        'describe(\'name\'), function () {\n'
        + '  it(\'func called with ("arg") should return "value"\'), function () {\n'
        + '    verify(\'name\').canHandle(\'func\').withArgs("arg").andReturns("value").on(sut));\n'
        + '  });\n'
        + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.be(expectedMethodString);
    });
    it('can work with different templates', function () {
      var assumption = createDefaultReturnValueAssumption().build();
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
      var expectedMethodString =
        'describe(\'name\'), function () {\n'
        + '  describe(\'func\'), function () {\n'
        + '    it(\'called with ("arg") should return "value"\'), function () {\n'
        + '      verify(\'name\').canHandle(\'func\').withArgs("arg").andReturns("value").on(sut));\n'
        + '    });\n'
        + '  });\n'
        + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.be(expectedMethodString);
    });
    it('should work with an throwErrorAssumption', function () {
      var assumption = createDefaultThrowErrorAssumption().build();
      var expectedMethodString =
        'describe(\'name\'), function () {\n'
        + '  it(\'called with ("arg") should throw error\'), function () {\n'
        + '    verify(\'name\').canHandle(\'func\').withArgs("arg").andThrowsError(\'message\').on(sut));\n'
        + '  });\n'
        + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.be(expectedMethodString);
    });
    it('should work with an callbackAssumption', function () {
      var assumption = createDefaultCallbackAssumption().withCallback(0, ['foo', 'bar']).build();
      var expectedMethodString =
        'describe(\'name\'), function () {\n'
        + '  it(\'func called with (function () {}, "arg") should call callback with ("foo", "bar")\'), function () {\n'
        + '    verify(\'name\').canHandle(\'func\').withArgs(callback, "arg").andCallsCallbackWith("foo", "bar").on(sut, function () {}));\n'
        + '  });\n'
        + '});\n';
      var actualMethodString = createVerificationMethod(template, assumption);
      expect(actualMethodString).to.be(expectedMethodString);
    });
  });
});

function createDefaultReturnValueAssumption() {
  return createAssumption()
    .withName('name')
    .withFunc('func')
    .withArgs(['arg'])
    .withReturnValue('value');
}

function createDefaultThrowErrorAssumption() {
  return createAssumption()
    .withName('name')
    .withFunc('func')
    .withArgs(['arg'])
    .withErrorMessage('message');
}

function createDefaultCallbackAssumption() {
  return createAssumption()
    .withName('name')
    .withFunc('func')
    .withArgs([function () {}, 'arg'])
    .withCallback(0, ['value']);
}

function createAssumption() {
  var assumption = {
    name: undefined,
    func: undefined,
    args: undefined,
    action: undefined
  };

  var builder = {
    withName: setName,
    withFunc: setFunc,
    withArgs: setArgs,
    withAction: setAction,
    withReturnValue: setReturnValue,
    withErrorMessage: setErrorMessage,
    withCallback: setCallback,
    build: build
  };

  function build() {
    return assumption;
  }

  function setName(name) {
    assumption.name = name;
    return builder;
  }

  function setFunc(func) {
    assumption.func = func;
    return builder;
  }

  function setArgs(args) {
    assumption.args = stringify(args);
    return builder;
  }

  function setAction(action) {
    assumption.action = action;
    return builder;
  }

  function setReturnValue(returnValue) {
    var actionString = actionStringLib.createReturnValueActionString(returnValue);
    setAction(actionString);
    return builder;
  }

  function setErrorMessage(message) {
    var actionString = actionStringLib.createThrowErrorActionString(message);
    setAction(actionString);
    return builder;
  }

  function setCallback(callbackIndex, callbackArgs) {
    var actionString = actionStringLib.createCallbackActionString(callbackIndex, callbackArgs);
    setAction(actionString);
    return builder;
  }

  return builder;
}
