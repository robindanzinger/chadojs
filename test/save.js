'use strict';

var expect = require('must');
describe('library save', function () {
  var repo;
  var save;

  before(function () {
    repo = {};
    save = require('../lib/save');
  });

  it('saves an array as a map to the given repository object', function () {
    var list = ['value1', 'value2', 1, 'value3'];
    save(list).to(repo);
    expect(repo.value1).exist();
    expect(repo.value1.value2['1'].value3).to.exist();
  });

  it('stringifies objects', function () {
    var obj = {prop1: 'prop', prop2: 2};
    var list = [obj];
    save(list).to(repo);
    expect(repo['{"prop1":"prop","prop2":2}']).to.exist();
  });

  it('returns the last map value', function () {
    var list = ['value'];
    var storedObject = save(list).to(repo);
    storedObject.prop = 5;
    expect(repo.value.prop).to.eql(storedObject.prop);
  });
});
