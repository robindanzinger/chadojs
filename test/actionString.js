var buster = require('buster');
var assert = buster.assert;
var actionString = require('../lib/actionString');
buster.testCase("library action", {
  "createReturnValueActionString creates a String for a returnValue action" : function (){
    assert.equals('r:"returnValue"', actionString.createReturnValueActionString("returnValue"));
  },
  "createCallbackActionString creates a String for a callback action" : function (){
    var callbackIndex = 2;
    var actualString = actionString.createCallbackActionString(
      callbackIndex, ["returnValue"]);
    assert.equals('cb:2->["returnValue"]', actualString);
  },
  "createThrowErrorActionString creates a String for a throwError action" : function () {
    assert.equals('ex:message', actionString.createThrowErrorActionString("message"));
  },
  "can parse an callbackValueActionString to a more readable" : function () {
    var callbackString = 'cb:2->["returnValue"]';
    var expected = 'calls 2 argument with ("returnValue")';
    assert.equals(expected, actionString.parse(callbackString));
  },
  "can parse an returnValueActionString to a more readable" : function () {
    var returnValueString = 'r:"returnValue"';
    var expected = 'returns "returnValue"';
    assert.equals(expected, actionString.parse(returnValueString));
  },
  "can parse an throwErrorActionString to a more readable" : function () {
    var throwErrorString = "ex:error message";
    var expected = 'throws Error: error message';
    assert.equals(expected, actionString.parse(throwErrorString));
  }
})
