'use strict';

function chado() {
  var testDouble = require('./testdouble');
  var repo = {};
  var assume = require('./assume')(repo);
  var verify = require('./verify')(repo);
  var analyzer = require('./analyzer');
  var consoleReporter = require('./reporter/console_reporter')(repo);
  var types = require('./types');
  var setCurrentTest = require('./track').setCurrentTest;

  return {
    assume: assume,
    verify: verify,
    createDouble: testDouble.createTestDoubleFor,
    repo: repo,
    analyzer: analyzer,
    create: create,
    consoleReporter: consoleReporter,
    callback: types.callback,
    setCurrentTest: setCurrentTest,
    reset: testDouble.resetTestDoubles
  };
}

var instance = chado();

function create() {
  return chado();
}

module.exports = instance;
