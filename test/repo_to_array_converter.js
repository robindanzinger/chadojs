var buster = require('buster'); 
var assert = buster.assert;
var refute = buster.refute;
var fs = require('fs');
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
    "complex example" : function () {
      this.json = {
        ObjectA:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path1":{"14":{"CallerFuncA":{}}}}}}}},
        ObjectB:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path2":{"14":{"CallerFuncB":{}}}},
                                                  "verify":{"path2b":{"42":{"CallerFuncB2":{}}}}}}}},
        ObjectC:{Method1:{'["Arg1"]':{ReturnVal1:{"assume":{"path3":{"14":{"CallerFuncC1":{}}}}}},
                          '["Arg2"]':{ReturnVal1:{"assume":{"path4":{"17":{"CallerFuncC2":{}}}}}}}}
      };
      assert.equals(transform(this.json).length, 5); 
    }
  }
});

function transform(obj) {
  return extractKeys(obj, []);
}

function extractKeys (obj, extractedKeys) {
  var result = [];
  if (Object.keys(obj).length > 0) {
    for (var prop in obj) {
      result = result.concat(extractKeys(obj[prop], extractedKeys.concat(prop))); 
    }
  } else if (extractedKeys.length > 0){
    result.push(createResult(extractedKeys));
  }
  return result;
}

function createResult(props) {
  var result = {};
  props.forEach(function(key, index){
    result[index+1] = key;
  });
  return result;
}




