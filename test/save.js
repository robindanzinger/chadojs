'use strict';

var expect = require('must');
describe('library save', function () {
  var repo = {};
  var save = require('../lib/save');

  beforeEach(function() {
    repo = {};
  });
  
  it('saves an array as a map to the given repository object', function () {
    save(['value1', 'value2', 1, 'value3']).to(repo);
    expect(repo.value1.value2['1'].value3).to.exist();
  });

  it('stringifies objects', function () {
    save([{prop1: 'prop', prop2: 2}]).to(repo);
    expect(repo['{"prop1":"prop","prop2":2}']).to.exist();
  });

  it('returns the last map value', function () {
    var storedObject = save(['value']).to(repo);
    expect(repo.value.prop).to.be.undefined();
    storedObject.prop = 5;
    expect(repo.value.prop).to.eql(5);
  });
});
