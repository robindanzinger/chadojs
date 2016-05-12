'use strict';
function save(array) {
  function to() {
    return function (repo) {
      var object = array.reduce(function (obj, key) {
        key = typeof key === 'string' ? key : JSON.stringify(key);
        if (!obj[key]) {
          obj[key] = {};
        }
        return obj[key];
      }, repo);
      return object;
    };
  }

  return {to: to()};
}

module.exports = save;
