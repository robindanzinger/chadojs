var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var is;
buster.testCase("library compare", {
  setUp : function () {
    is = require('../lib/compare');
  },
  "simple objects are similar when they are equal" : function () {
    assert(is('foo').similarTo('foo'));
    refute(is('foo').similarTo('bar'));
    assert(is(true).similarTo(true));
    assert(is(false).similarTo(false));
  },
  "arrays should be similar, when all elements are equal and in same order" : function () {
    var array = ["first", "second", 3, true];
    assert(is(array).similarTo(["first", "second", 3, true]));
  }
})
