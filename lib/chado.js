'use strict';

function chado() {
  var testDouble = require('./testdouble');
  var repo = {};

  function create() {
    return chado();
  }

  return {
    assume: require('./assume')(repo),
    verify: require('./verify')(repo),
    stub: require('./stub'),
    createDouble: testDouble.createDouble,
    repo: repo,
    analyzer: require('./analyzer'),
    create: create,
    consoleReporter: require('./reporter/console_reporter')(repo),
    callback: require('./types').callback,
    setCurrentTest: require('./track').setCurrentTest,
    reset: testDouble.resetAllDoubles,
    types: require('./types')
  };
}

module.exports = chado();
