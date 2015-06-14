'use strict';

var expect = require('must');
describe('library compare', function () {
  var is;
  before(function () {
    is = require('../lib/compare');
  });

  it('simple objects are similar when they are equal', function () {
    expect(is('foo').similarTo('foo')).to.be.true();
    expect(is('foo').similarTo('bar')).to.be.false();
    expect(is(true).similarTo(true)).to.be.true();
    expect(is(false).similarTo(false)).to.be.true();
    expect(is(false).similarTo('')).to.be.false();
    expect(is(4).similarTo('4')).to.be.false();
    expect(is(new Date(2014, 1, 2)).similarTo(new Date(2014, 1, 2))).to.be.true();
    expect(is(new Date(2013, 13, 1)).similarTo(new Date(2014, 1, 1))).to.be.true();
    expect(is(new Date(2014, 1, 2)).similarTo(new Date(2015, 1, 2))).to.be.false();
  });

  it('arrays should be similar, when all elements are equal and in same order', function () {
    var array = ['first', 'second', 3, true];
    expect(is(array).similarTo(['first', 'second', 3, true])).to.be.true();
    expect(is(array).similarTo(['first', 'second', true, 3])).to.be.false();
    expect(is(null).similarTo(array)).to.be.false();
    expect(is({}).similarTo(array)).to.be.false();
  });

  it('objects should be similar, when the second object contains the same properties as the first object', function () {
    var firstObject = {property: 'value'};
    expect(is(firstObject).similarTo({property: 'value'})).to.be.true();
    expect(is(firstObject).similarTo({property: 'value', prop2: 2})).to.be.true();
    expect(is({prop: 'val', dat: new Date(2014, 0, 1)}).similarTo({
      dat: new Date(2014, 0, 1),
      prop: 'val'
    })).to.be.true();
  });
});
