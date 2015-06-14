'use strict';

var actionString = require('../lib/actionString');
var expect = require('must');
describe('library actionString', function () {
  it('createReturnValueActionString creates a String for a returnValue action', function () {
    expect(actionString.createReturnValueActionString('returnValue')).to.be('r:"returnValue"');
  });

  it('createCallbackActionString creates a String for a callback action', function () {
    var callbackIndex = 2;
    var actualString = actionString.createCallbackActionString(callbackIndex, ['returnValue']);
    expect(actualString).to.be('cb:2->["returnValue"]');
  });

  it('createThrowErrorActionString creates a String for a throwError action', function () {
    expect(actionString.createThrowErrorActionString('message')).to.be('ex:message');
  });

  it('can transfrom a callbackValueActionString to a more readable', function () {
    var callbackString = 'cb:2->["returnValue"]';
    var expected = 'calls 2. argument with ("returnValue")';
    expect(actionString.makeHumanReadableActionString(callbackString)).to.be(expected);
  });

  it('can transform a returnValueActionString to a more readable', function () {
    var returnValueString = 'r:"returnValue"';
    var expected = 'returns "returnValue"';
    expect(actionString.makeHumanReadableActionString(returnValueString)).to.be(expected);
  });

  it('can transform a throwErrorActionString to a more readable', function () {
    var throwErrorString = 'ex:error message';
    var expected = 'throws Error: error message';
    expect(actionString.makeHumanReadableActionString(throwErrorString)).to.be(expected);
  });

  it('can parse a callbackValueActionString', function () {
    var callbackString = 'cb:2->["returnValue"]';
    var expected = {type: 'callback', value: 'returnValue', callbackIndex: 2};
    expect(actionString.parseAction(callbackString)).to.eql(expected);
  });

  it('can parse a returnValueActionString', function () {
    var returnValueString = 'r:"returnValue"';
    var expected = {type: 'returnValue', value: 'returnValue'};
    expect(actionString.parseAction(returnValueString)).to.eql(expected);
  });

  it('can parse a throwErrorActionString', function () {
    var throwErrorString = 'ex:error message';
    var expected = {type: 'throwError', message: 'error message'};
    expect(actionString.parseAction(throwErrorString)).to.eql(expected);
  });
});
