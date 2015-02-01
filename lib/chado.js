"use strict";

function chado () {
  var testDoubleRepo = require('./testdouble')();
  var createDouble = testDoubleRepo.createTestDoubleFor;
  var repo = {};
  var assume = require('./assume')(repo, testDoubleRepo);
  var verify = require('./verify')(repo);
  var report = require('./report');

  return  {
    testDoubleRepo : testDoubleRepo,
    assume : assume,
    verify : verify,
    createDouble : createDouble,
    repo : repo,
    report : report,
    create : create
  }
}

var instance = chado();

function create () {
  return new chado();
}

module.exports = instance;
