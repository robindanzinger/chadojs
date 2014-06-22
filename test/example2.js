var buster = require('buster');
var fs = require('fs');
var assert = buster.assert;
var refute = buster.refute;
var chado = require('../lib/chado').create();
var assume = chado.assume;
var verify = chado.verify;
var report = chado.report;
var createDouble = chado.createDouble;
buster.testCase("Key-Value-Store with Caching Example", {
  "make some assumptions and verifications and store repo to the file" : function () {
    var cache = createDouble("Cache");
    var db = createDouble("Db");
    var repo = createDouble("Repo");

    assume(cache).canHandle("hasValue").withArgs("anyUnknownId").andReturn(false);
    assume(cache).canHandle("hasValue").withArgs("anyId").andReturn(true);
    assume(cache).canHandle("storeValue").withArgs("anyUnknownId", {id: "anyUnknownId", value: "anyValue"}).andReturn();
    assume(cache).canHandle("getCachedValue").withArgs("anyId").andReturn({id: "anyId", value: "anyValue"});
    assume(db).canHandle("loadValue").withArgs("anyUnknownId").andReturn({id: "anyUnknownId", value: "anyValue"});
    assume(repo).canHandle("get").withArgs("anyId").andReturn({id: "anyId", value: "anyValue"});
    assume(repo).canHandle("get").withArgs("anyUnknownId").andReturn({id: "anyUnknownId", value: "anyValue"});

    assume(repo).canHandle("xxx").withArgs({id: "xxx", val: "anyVal"}).andReturn("foo");
    assume(repo).canHandle("yyy").withArgs({id: "yyy", val: "anyVal"}).andReturn({id: "foo", val: "val"});
    var realRepo = new RealRepo(cache, db);

    var loadedValue = realRepo.get("anyUnknownId");
    var cachedValue = realRepo.get("anyId");

    assert.equals(loadedValue.id, "anyUnknownId");
    assert.equals(cachedValue.id, "anyId");

    fs.writeFile("test.xml", JSON.stringify(chado.repo, null, 2)); 
  }
});

function RealRepo(cache, db) {
  var cache = cache;
  var db = db;

  function get (id) {
    if (cache.hasValue(id)) {
      return cache.getCachedValue(id);
    }
    var obj = db.loadValue(id);
    cache.storeValue(id, obj);
    return obj;
  };

  return { get: get};
}

function RealCache() {
  var cacheMap = {};
  function hasValue(id) {
    return cacheMap.containsKey(id);
  };

  function getCachedValue(id) {
    return cacheMap.get(id);
  };

  function storeValue(id, value) {
    cacheMap.put(id, value);
  };
}
function RealDb() {
  function loadValue(id) {
    return {id: id, value: "anyValue"};
  };
}
