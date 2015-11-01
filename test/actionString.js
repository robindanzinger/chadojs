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

  it('can transform a callbackValueActionString to a more readable', function () {
    expect(actionString.makeHumanReadableActionString('cb:2->["returnValue"]')).to.be('calls 2. argument with ("returnValue")');
  });

  it('can transform a returnValueActionString to a more readable', function () {
    expect(actionString.makeHumanReadableActionString('r:"returnValue"')).to.be('returns "returnValue"');
  });

  it('can transform a throwErrorActionString to a more readable', function () {
    expect(actionString.makeHumanReadableActionString('ex:error message')).to.be('throws Error: error message');
  });

  it('can parse a callbackValueActionString', function () {
    expect(actionString.parseActionString('cb:2->["returnValue"]')).to.eql({
      type: 'callback',
      value: ['returnValue'],
      callbackIndex: 2
    });
  });

  it('can parse a returnValueActionString', function () {
    expect(actionString.parseActionString('r:"returnValue"')).to.eql({type: 'returnValue', value: 'returnValue'});
  });

  it('can parse a throwErrorActionString', function () {
    expect(actionString.parseActionString('ex:error message')).to.eql({type: 'throwError', message: 'error message'});
  });
});
