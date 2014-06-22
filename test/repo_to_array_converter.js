var buster = require('buster');
var assert = buster.assert;
var refute = buster.refute;
buster.testCase("Convert a map to an object" , {
  "should contain all keys as property values" : function () {
    var data = {
    "Cache": {
      "hasValue": {
        "[\"anyUnknownId\"]": {
          "false": {
            "assume": {
              "C:\\Users\\Robin\\Documents\\GitHub\\chadojs\\test\\example2.js": {
                "16": {}
              }
            },
            "calledBy": {
              "C:\\Users\\Robin\\Documents\\GitHub\\chadojs\\test\\example2.js": {
                "43": {
                  "func": "Object.get"
                }
              }
            }
          }
        }
      }
    }
    };

    var obj = {};
    convertMapToObject(data, obj, "className", "methodName", "parameters", "returnValue");

    assert.equals(obj.className, "Cache");
    assert.equals(obj.returnValue, "false");
    assert.equals(obj.parameters, "[\"anyUnknownId\"]");
    assert.equals(obj.methodName, "hasValue"); 
  }
});

function convertMapToObject(map, obj, propName) {
  var restPropNames = Array.prototype.slice.call(arguments, 3);
  for (var prop in map) {
    obj[propName] = prop;
    if (restPropNames.length > 0) {
      var func = convertMapToObject.bind(null, map[prop], obj);
      return func.apply(null, restPropNames);
    }
  }
}
