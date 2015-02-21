var buster = require('buster');
var assert = buster.assert;
var action = require('../lib/action');
buster.testCase("library action", {
  "createReturnValueActionString creates a String for a returnValue action" : function (){
    assert.equals('r:"returnValue"', action.createReturnValueActionString("returnValue"));
  },
  "createCallbackActionString creates a String for a callback action" : function (){
    var callbackIndex = 2;
    var actualString = action.createCallbackActionString(
      callbackIndex, ["returnValue"]);
    assert.equals('cb:2->["returnValue"]', actualString);
  }
})
