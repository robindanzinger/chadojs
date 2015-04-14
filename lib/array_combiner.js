"use strict";
function combine() {
  var arrays = Array.prototype.slice.call(arguments, 0);
  var combinedArrays = [[]];
  arrays.forEach(function (array) {
    var temp = [];
    array.forEach(function (element) {
      combinedArrays.forEach(function (combinedArray) {
        temp.push(combinedArray.concat(element));
      });
    });
    if (temp.length > 0) {
      combinedArrays = temp;
    }
  });
  return combinedArrays;
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
