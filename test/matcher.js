'use strict';

var expect = require('must');
//var any = require('../lib/types').any;
//var anyValue = require('../lib/types').anyValue;
var lib = require('../lib/matcher');
var findMatcher = lib.findMatcher;
var create = lib.createMatcher;

describe('library matcher', function () {

  describe('findMatcher', function () {
    it('returns matching matcher for one argument', function () {
       var matcher = create(1);
       expect(findMatcher(matcher, 1)).to.be(matcher);
       matcher = create(2);
       expect(findMatcher(matcher, 2)).to.be(matcher);
    });
    it('returns undefined when no match found', function () {
      expect(findMatcher(create(1), 2)).to.be(undefined);
    });
    it('returns matching matcher for two arguments', function () {
      var matcher = create(1, 'aString');
      expect(findMatcher(matcher, 1, 'aString')).to.be(matcher);
    });
    it('returns undefined when second argument doesn\'t match', function () {
      expect(findMatcher(create(1, 'aString'), 1, 'anotherString')).to.be(undefined);
    });
    it('given two matchers, returns the matching matcher', function () {
      var matchers = [create(1), create(2)];
      expect(findMatcher(matchers, 1)).to.be(matchers[0]);
      expect(findMatcher(matchers, 2)).to.be(matchers[1]);
    });
  });
});
