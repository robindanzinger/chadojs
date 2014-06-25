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
  },
  "should convert map to array" : function () {
    var map = { "Key1": {}, "Key2": {}};

    var array = convertMapToArray(map);

    assert.equals(array[0], {"Name" : "Key1", "Values" : []});
    assert.equals(array[1], {"Name" : "Key2", "Values" : []});
  },
  "should convert map in map to array" : function () {
    var map = { "Key1": {"SubKey11": {}, "SubKey12": {}}, "Key2": {"SubKey21":{}}};

    var array = convertMapToArray(map);

    assert.equals(array[0], {"Name" : "Key1", "Values" : [{"Name":"SubKey11","Values":[]},{"Name":"SubKey12","Values":[]}]});
    assert.equals(array[1], {"Name" : "Key2", "Values" : [{"Name":"SubKey21","Values":[]}]});
  },
  "can limit convertion of submaps" : function () {
    var map = { "Key1": {"prop":"value"}};

    var array = convertMapToArray(map, 1);

    assert.equals(array[0], {"Name" : "Key1", "Value" : {"prop":"value"}}); 
  }
});

function convertMapToArray(map, limit) {
  if (limit === 1) {
    return convertLastMapToArray(map);
  }
  return convertMapAndSubMapToArray(map, limit); 
}

function convertLastMapToArray(map) {
  var array = [];
  for (prop in map) {
    array.push({"Name":prop,"Value":map[prop]});
  }
  return array;
} 

function convertMapAndSubMapToArray(map, limit){
  var array = [];
  limit = limit > 1 ? limit -1 : undefined; 
  for (prop in map) {
    array.push({"Name":prop,"Values":convertMapToArray(map[prop], limit)});
  }
  return array; 
} 

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
