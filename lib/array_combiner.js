"use strict";
function combine() {
  var arrays = Array.prototype.slice.call(arguments, 0);
  var result = [[]];
  for(var i = 0; i < arrays.length; i++) {
    var newresult = [];
    arrays[i].forEach(function (element) {
      result.forEach(function (array) {
        newresult.push(array.concat(element));
      });
    });
    if (newresult.length > 0) {
      result = newresult;
    }
  }
  return result;
}

module.exports = combine;
