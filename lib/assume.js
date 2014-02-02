"use strict";

function assume(lib) {
  var funcName;
  var args = null;

  function canHandle(nFuncName) {
    funcName = nFuncName;
    return {
      andReturn : andReturn,
      withArgs : withArgs       
    };
  }

  function withArgs() {
    args = Array.prototype.slice.call(arguments);
    args = JSON.stringify(args);
    return {
      andReturn : andReturn
    };
  }

  function andReturn(returnValue) {
    stub();
    lib[funcName].mapArgs2ReturnValue[args] = returnValue;
  }

  function stub() {
    if (!lib[funcName]) {
      lib[funcName] = function () {
        var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : null;
        args = JSON.stringify(args);
        if (lib[funcName].mapArgs2ReturnValue[args]) 
          return lib[funcName].mapArgs2ReturnValue[args];
        throw Error("Did not expect function call with " + args + ". Expected arguments for this function are: " + lib[funcName].mapArgs2ReturnValue);
      };     
      lib[funcName].mapArgs2ReturnValue = {};
    }
  }

  return {canHandle : canHandle}
}

module.exports = {
  assume : assume
}
