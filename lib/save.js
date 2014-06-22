"use strict";
var repo;

function save(array) {
  return {to: to(array)};
}

function to(array) {
  return function (repo) {
    var object = array.reduce(function (obj, key) {
      key = typeof key === "string" ? key : JSON.stringify(key);
      if (!obj[key]) {
        {obj[key] = {}};
      }
      return obj[key];
    }, repo);
    return object;
  };
}

module.exports = save;
