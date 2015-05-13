var buster = require('buster'); 
var assert = buster.assert;
var refute = buster.refute;
var transform = require('../lib/array_transformer');
buster.testCase("Chado Object Keys to Array Transformer", {
  "It transforms the json map to an array" : {
    "{} should result in []" : function () {
      assert.equals([], transform({}));
    },
    "{A:{}} should result in [{1:A}]" : function () {
      assert.equals([{1:'A'}], transform({A:{}}));
    },
    "{A:{},B:{}} should result in [{1:A},{1:B}]" : function () {
      assert.equals([{1:'A'}, {1:'B'}], transform({A:{},B:{}}));
    },
    "{A:{B:{}}} should result in [{1:A,2:B}]" : function () {
      assert.equals([{1:'A', 2:'B'}], transform({A:{B:{}}}));
    },
    "{A:{B:{C:{}}}} should result in [{1:A,2:B,3:C}]" : function () {
      assert.equals([{1:'A', 2:'B', 3:'C'}], transform({A:{B:{C:{}}}}));
    },
    "{A:{C:{}}} should result in [{1:A,2:C}]" : function () {
      assert.equals([{1:'A', 2:'C'}], transform({A:{C:{}}}));
    },
    "{A:{B:{}, C:{}}} should result in two objects A->B and A->C" : function () {
      var array = transform({A:{B:{}, C:{}}});
      assert.equals(array.length, 2);
    },
    "can define a value parser" : function () {
      var parser = function (value) { return "<" + value + ">"};
      var result = transform({A:{B:{}}}, ['KEY1', 'KEY2'], {'KEY2': parser});
      assert.equals([{'KEY1':'A', 'KEY2':'<B>'}], result);
    },
    "complex example" : function () {
      this.json = {
        ObjectA:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path1":{"14":{"CallerFuncA":{}}}}}}}},
        ObjectB:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path2":{"14":{"CallerFuncB":{}}}},
                                                  "verify":{"path2b":{"42":{"CallerFuncB2":{}}}}}}}},
        ObjectC:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path3":{"14":{"CallerFuncC1":{}}}}}},
                          '["Arg2"]':{ReturnVal1:{"assume":{"path4":{"17":{"CallerFuncC2":{}}}}}}}}
      };
      assert.equals(transform(this.json).length, 5); 
    },
    "can set names instead of index" : function () {
      assert.equals([{'KEY1':'A', 'KEY2':'B'}, {'KEY1':'C'}], transform({A:{B:{}},C:{}}, ['KEY1', 'KEY2']));
    }
  }
});

