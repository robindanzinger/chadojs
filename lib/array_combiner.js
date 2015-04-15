"use strict";
function combine() {
  var arrays = Array.prototype.slice.call(arguments, 0)
    .filter(function(array) {
      return array.length > 0;
    });
  var combinedArrays = [[]];
  arrays.forEach(function (array) {
    var temp = [];
    combinedArrays.forEach(function (combinedArray) {
      array.forEach(function (element) {
        temp.push(combinedArray.concat(element));
      });
    });
    combinedArrays = temp;
  });
  return combinedArrays;
}

module.exports = combine;
