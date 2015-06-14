'use strict';
function extractKeys(obj, extractedKeys, keynames, optionalValueParser) {
  var result = [];
  if (Object.keys(obj).length > 0) {
    for (var prop in obj) {
      result = result.concat(extractKeys(obj[prop], extractedKeys.concat(prop), keynames, optionalValueParser)); 
    }
  } else if (extractedKeys.length > 0){
    result.push(createResult(extractedKeys, keynames, optionalValueParser));
  }
  return result;
}

function createResult(props, keynames, optionalValueParser) {
  var result = {};
  props.forEach(function(value, index){
    var key = getKeyNameOrIndex(keynames, index);
    if (optionalValueParser[key] !== undefined) {
      value = optionalValueParser[key](value);
    }
    result[getKeyNameOrIndex(keynames, index)] = value;
  });
  return result;
}

function getKeyNameOrIndex(keynames, index) {
  if (Array.isArray(keynames) && keynames.length > index) {
    return keynames[index];
  }
  return index + 1;
}

function transform(obj, optionalKeynames, optionalValueParser) {
  optionalValueParser = optionalValueParser === undefined ? {} : optionalValueParser;
  return extractKeys(obj, [], optionalKeynames, optionalValueParser);
}

module.exports = transform;
