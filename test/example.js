var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
var chado = require('../lib/chado').create();
var assume = chado.assume;
var verify = chado.verify;
var report = chado.report;
var createDouble = chado.createDouble;
buster.testCase("Example", {
  "assume we have a simple key value store" : {
    setUp : function () {
      this.store = createDouble('store');
    },
    "it should be possible to add a new value" : function () {
      assume(this.store).canHandle('add').withArgs('myKey', 'myValue').andReturn();
    //  console.log(report.getNotVerifiedAssumptions(chado.repo));
      assert.equals(this.store.add('myKey', 'myValue'), undefined);
    },
    "we should get the value with the correct key" : function () {
      assume(this.store).canHandle('get').withArgs('myKey').andReturn('myValue');
      assert.equals(this.store.get('myKey'), 'myValue');
    },
    "we should get null, if the value is not stored" : function () {
      assume(this.store).canHandle('get').withArgs('myKey').andReturn(null);
      assert.equals(this.store.get('myKey'), null);
      console.log(report.getNotVerifiedAssumptions(chado.repo));
    }
  }
});

