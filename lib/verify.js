"use strict";

function verify(libName) {
  var funcName;
  var args = undefined;
  var expectedReturnValue = null;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    return {
      andReturn : andReturn
    };
  }

  function andReturn(nExpectedReturnValue) {
    expectedReturnValue = nExpectedReturnValue;
    return {
      on : on
    };
  }

  function on(sut) {
    var actualReturnValue = sut[funcName](args);
    return actualReturnValue == expectedReturnValue; 
  }


  return {canHandle : canHandle}
}

module.exports = {
  verify : verify 
}
