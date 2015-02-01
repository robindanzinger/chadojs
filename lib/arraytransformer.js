"use strict";
function transform(obj, optionalKeynames) {
  return extractKeys(obj, [], optionalKeynames);
}

function extractKeys (obj, extractedKeys, keynames) {
  var result = [];
  if (Object.keys(obj).length > 0) {
    for (var prop in obj) {
      result = result.concat(extractKeys(obj[prop], extractedKeys.concat(prop), keynames)); 
    }
  } else if (extractedKeys.length > 0){
    result.push(createResult(extractedKeys, keynames));
  }
  return result;
}

function createResult(props, keynames) {
  var result = {};
  props.forEach(function(keyValue, index){
   result[getKeyNameOrIndex(keynames, index)] = keyValue;
  });
  return result;
}

function getKeyNameOrIndex(keynames, index) {
  if (Array.isArray(keynames) && keynames.length > index) {
    return keynames[index];
  }
  return index+1;
}

module.exports = transform;



