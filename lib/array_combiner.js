"use strict";
function combine() {
  var arrays = Array.prototype.slice.call(arguments, 0);
  var result = [[]];
  arrays.forEach(function (array) {
    var newresult = [];
    array.forEach(function (element) {
      result.forEach(function (array) {
        newresult.push(array.concat(element));
      });
    });
    if (newresult.length > 0) {
      result = newresult;
    }
  });
  return result;
}

function alt_combine() {
  var originalArrays = Array.prototype.slice.call(arguments, 0);
  var combinedArrays = [[]];
  originalArrays.forEach(function (originalArray) {
    if (originalArray.length == 0) {
      return;
    }
    combinedArrays = combinedArrays.map(function (combinedArray) {
      return originalArray.map(concat.bind(null, combinedArray));
    }).reduce(concat, []);
  });
  return combinedArrays;
}

function concat(first, second) {
  return first.concat(second);
}

module.exports = combine;
