"use strict";

function chado () {
  var createDouble = require('./testdouble').createTestDoubleFor;
  var repo = {};
  var assume = require('./assume')(repo);
  var verify = require('./verify')(repo);
  var analyzer = require('./analyzer');
  var consoleReporter = require('./reporter/console_reporter')(repo);
  var types = require('./types');

  return  {
    assume : assume,
    verify : verify,
    createDouble : createDouble,
    repo : repo,
    analyzer : analyzer,
    create : create,
    consoleReporter : consoleReporter,
    callback : types.callback
  }
}

var instance = chado();

function create () {
  return new chado();
}

module.exports = instance;
