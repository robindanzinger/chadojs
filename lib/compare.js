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
  if (Array.isArray(first)) {
    return first.every(function(element, index) {
      return isSimilar(element, second[index]);    
    });
  }
  return first == second;
}

module.exports = is;
