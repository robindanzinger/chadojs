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
    refute(is(false).similarTo(''));
    refute(is(4).similarTo('4'));
    assert(is(new Date(2014, 1, 2)).similarTo(new Date(2014, 1, 2)));
    assert(is(new Date(2013, 13, 1)).similarTo(new Date(2014, 1, 1)));
    refute(is(new Date(2014, 1, 2)).similarTo(new Date(2015, 1, 2)));
  },
  "arrays should be similar, when all elements are equal and in same order" : function () {
    var array = ["first", "second", 3, true];
    assert(is(array).similarTo(["first", "second", 3, true]));
    refute(is(array).similarTo(["first", "second", true, 3]));
    refute(is(null).similarTo(array));
    refute(is({}).similarTo(array));
  },
  "objects should be similar, when the second object contains the same properties as the first object" : function () {
    var firstObject = {property : "value"};
    assert(is(firstObject).similarTo({property:"value"}));
    assert(is(firstObject).similarTo({property:"value",prop2:2}));
    assert(is({prop:"val",dat:new Date(2014,0,1)}).similarTo({dat:new Date(2014,0,1),prop:"val"}));
  }
})
