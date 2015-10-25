'use strict';

function chado() {
  var createDouble = require('./testdouble').createTestDoubleFor;
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
    createDouble: createDouble,
    repo: repo,
    analyzer: analyzer,
    create: create,
    consoleReporter: consoleReporter,
    callback: types.callback,
    setCurrentTest: setCurrentTest,
    reset: function () {
      if (repo.originals) {
        repo.originals.forEach(function (original) {
          Object.keys(original._chadoBackup).forEach(function (functionName) {
            original[functionName] = original._chadoBackup[functionName];
          });
        });
      }
    }
  };
}

var instance = chado();

function create() {
  return chado();
}

module.exports = instance;
