var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Test Callbacks", {
  "a function which calls a callback" : function () {
    var func = function (callback) {
      callback();
    }
    func(function () {
      assert(true);
    });
  },
  "cook needs time" : function (done) {
    var cook = stub();
    assume(cook, "broilSteak").withArgs(ct.anyCallback).callsWith("steak");
    var waiter = Waiter(cook);
    waiter.bringSteak(function (meal) {
      assert.equals("steak", meal);
      done();
    });
  }
});

var ct = {
  anyCallback : {}
}

function stub() {
  return {
  }
}

function assume(obj, method) {
  var callbacks = [];

  function withArgs(arg) {
    if (arg == ct.anyCallback)
      callbacks.push[0];
     return {
       callsWith : callsWith
     }
  }

  function callsWith(result) {
    obj[method] = function(callback) {
      setTimeout(function () {
      callback(result);
      }, 0);
    }
  }

  return {
    withArgs : withArgs
  }
}

function Waiter(cook) {
  function bringSteak(callback) {
    cook.broilSteak(function (steak) {
      callback(steak);
    });
  }
  return {
    bringSteak: bringSteak
  }
}

function Cook() {
  function broilSteak(callback) {
    setTimeout(function () {
      callback("steak");
    }, 100);
  }

  return {
    broilSteak : broilSteak
  }
}
