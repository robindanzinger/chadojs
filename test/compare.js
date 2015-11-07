'use strict';

var expect = require('must');
var is = require('../lib/compare');

describe('library compare', function () {
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

  it('arrays should be similar, when all elements of the first array are equal but not in same order', function () {
    var array = ['first', 'second', 3, true];
    expect(is(array).similarTo(['first', 'second', 3, true])).to.be.true();
    expect(is(array).similarTo(['first', 'second', true, 3])).to.be.true();
    expect(is(array).similarTo(['first', 'second', true, 3, 8])).to.be.true();
    expect(is(array).similarTo(['first', 'second', true])).to.be.false();
    expect(is(null).similarTo(array)).to.be.false();
    expect(is({}).similarTo(array)).to.be.false();
  });

  it('objects should be similar, when the second object contains at least the same properties and values as the first object', function () {
    var firstObject = {property: 'value'};
    expect(is(firstObject).similarTo({property: 'value'})).to.be.true();
    expect(is(firstObject).similarTo({property: 'value', prop2: 2})).to.be.true();
    expect(is({prop: 'val', dat: new Date(2014, 0, 1)}).similarTo({
      dat: new Date(2014, 0, 1),
      prop: 'val'
    })).to.be.true();
  });

  it('two empty arrays should be similar', function () {
    expect(is([]).similarTo([])).to.be.true();
  });

  it('objects should be similar, when the second object contains the same properties as the first object', function () {
    var firstObject = JSON.parse('[null,{"state":{"title":"Title of the Activity","description":"description1","assignedGroup":"groupname","location":"location1","direction":"direction1","startUnix":1356994800,"url":"urlOfTheActivity","owner":"ownerId","resources":{"Veranstaltung":{"_registeredMembers":[],"_registrationOpen":true}},"_addons":{}},"group":{"id":"groupname","longName":"Buxtehude","organizers":[]},"participants":[{"state":{"id":"memberId1","nickname":"participant1","email":"a@b.c"}},{"state":{"id":"memberId2","nickname":"participant2","email":"a@b.c"}}],"ownerNickname":"owner"}]');
    var secondObject = JSON.parse('[null,{"state":{"title":"Title of the Activity","description":"description1","assignedGroup":"groupname","location":"location1","direction":"direction1","startUnix":1356994800,"url":"urlOfTheActivity","owner":"ownerId","resources":{"Veranstaltung":{"_registeredMembers":[],"_registrationOpen":true}},"_addons":{}},"group":{"id":"groupname","longName":"Buxtehude","organizers":[]},"participants":[{"state":{"id":"memberId1","nickname":"participant1","email":"a@b.c"}},{"state":{"id":"memberId2","nickname":"participant2","email":"a@b.c"}}],"ownerNickname":"owner"}]');
    expect(is(firstObject).similarTo(secondObject)).to.be.true();
  });
});
