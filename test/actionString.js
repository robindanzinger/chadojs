var buster = require('buster');
var assert = buster.assert;
var actionString = require('../lib/actionString');
buster.testCase("library actionString", {
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
  "can transfrom a callbackValueActionString to a more readable" : function () {
    var callbackString = 'cb:2->["returnValue"]';
    var expected = 'calls 2. argument with ("returnValue")';
    assert.equals(expected, actionString.makeHumanReadableActionString(callbackString));
  },
  "can transform a returnValueActionString to a more readable" : function () {
    var returnValueString = 'r:"returnValue"';
    var expected = 'returns "returnValue"';
    assert.equals(expected, actionString.makeHumanReadableActionString(returnValueString));
  },
  "can transform a throwErrorActionString to a more readable" : function () {
    var throwErrorString = "ex:error message";
    var expected = 'throws Error: error message';
    assert.equals(expected, actionString.makeHumanReadableActionString(throwErrorString));
  },
  "can parse a callbackValueActionString" : function () {
    var callbackString = 'cb:2->["returnValue"]';
    var expected = {type:"callback", value:"returnValue", callbackIndex:2};
    assert.equals(expected, actionString.parseAction(callbackString));
  },
  "can parse a returnValueActionString" : function () {
    var returnValueString = 'r:"returnValue"';
    var expected = {type:"returnValue", value:"returnValue"};
    assert.equals(expected, actionString.parseAction(returnValueString));
  },
  "can parse a throwErrorActionString" : function () {
    var throwErrorString = "ex:error message";
    var expected = {type:"throwError", message:"error message"};
    assert.equals(expected, actionString.parseAction(throwErrorString));
  }
});
