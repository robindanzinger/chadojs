"use strict";
function is(first) {
  return {similarTo : similarTo(first)};
}

function similarTo(first) {
  return function (second) {
    return isSimilar(first, second);    
  };
}

function isSimilar(first, second) {
  if (first === null || first === undefined) {
    return first === second;
  }
  if (isObjectWithProperties(first)) {
     return Object.keys(first).every(function(key) {
      return isSimilar(first[key], second[key])
    });
  }
  if (Object.prototype.toString.call(first) === '[object Date]') {
    return first.valueOf() === second.valueOf();
  }
  return Object.is(first, second);
}

function isObjectWithProperties(first) {
  return typeof first === 'object' && Object.keys(first).length > 0;  
}

module.exports = is;
