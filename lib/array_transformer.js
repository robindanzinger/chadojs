'use strict';
function extractKeys(obj, extractedKeys, keynames, optionalValueParser) {
  function createResult(props) {
    function getKeyNameOrIndex(index) {
      if (Array.isArray(keynames) && keynames.length > index) {
        return keynames[index];
      }
      return index + 1;
    }

    var result = {};
    props.forEach(function (value, index) {
      var key = getKeyNameOrIndex(index);
      if (optionalValueParser[key] !== undefined) {
        value = optionalValueParser[key](value);
      }
      result[getKeyNameOrIndex(index)] = value;
    });
    return result;
  }

  var result = [];
  if (Object.keys(obj).length > 0) {
    for (var prop in obj) {
      result = result.concat(extractKeys(obj[prop], extractedKeys.concat(prop), keynames, optionalValueParser));
    }
  } else if (extractedKeys.length > 0) {
    result.push(createResult(extractedKeys, keynames, optionalValueParser));
  }
  return result;
}

function transform(obj, optionalKeynames, optionalValueParser) {
  optionalValueParser = optionalValueParser === undefined ? {} : optionalValueParser;
  return extractKeys(obj, [], optionalKeynames, optionalValueParser);
}

module.exports = transform;
