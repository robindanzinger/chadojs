var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var repo;
var save;
buster.testCase("library save", {
  setUp : function () {
    repo = {};
    save = require('../lib/save');
  },
  "saves an array as a map to the given repository object" : function () {
    var list = ["value1", "value2", 1, "value3"];

    save(list).to(repo);
    assert(repo.value1);
    assert(repo.value1.value2["1"].value3);
  },
  "stringifies objects" : function () {
    var obj = {prop1: "prop", prop2: 2};
    var list = [obj];
    save(list).to(repo);
    assert(repo['{"prop1":"prop","prop2":2}']);
  },
  "returns the last map value" : function () {
    var list = ["value"];
    var storedObject = save(list).to(repo);
    storedObject.prop = 5;
    assert.equals(repo.value.prop, storedObject.prop);  
  }
});
