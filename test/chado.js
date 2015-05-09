var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var chado = require('../lib/chado');
buster.testCase("library chado", {
  "has access to chado.assume" : function () {
    assert(chado.assume);
  },
  "has access to chado.verify" : function () {
    assert(chado.verify);
  },
  "has access to chado.createDouble" : function () {
    assert(chado.createDouble);
  },
  "if chado is loaded twice, same objects are used" : function () {
    var chado2 = require('../lib/chado');
    var assume = chado.assume;
    var createDouble = chado.createDouble;
    var lib = createDouble("myLib");
    assume(lib).canHandle("foo").andReturns("bar");

    assert(chado2.repo.myLib.foo);
  },
  "can create a new chado config" : function () {
    var chado2 = chado.create();
    var assume = chado.assume;
    var createDouble = chado.createDouble;
    var lib = createDouble("myLib");
    assume(lib).canHandle("foo").andReturns("bar");

    refute(chado2.repo.myLib);
    assert(chado.repo.myLib.foo);
  }
});

