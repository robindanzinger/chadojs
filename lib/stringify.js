"use strict";
function stringify(obj) {
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      return '=>function';
    }
    var regex = /^\/*=>function$/;
    if (typeof value === 'string' && regex.test(value)) {
      return '/' + value;
    }
    return value;
  });
}

function parse(str) {
  return JSON.parse(str, function (key, value) {
    if (typeof value === 'string') {
      if (value === '=>function') {
        return function () {};
      }
      var regex = /\/*=>function/;
      if (regex.test(value)) {
        return value.substring(1);
      }
    }
    return value;
  });
}

module.exports = {
  parse : parse,
  stringify : stringify
};
