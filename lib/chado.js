"use strict";

var testDoubleRepo = require('./testdouble')();
var createDouble = testDoubleRepo.createTestDoubleFor;
var repo = {};
var assume = require('./assume')(repo, testDoubleRepo);
var verify = require('./verify')(repo);

module.exports = {
  testDoubleRepo : testDoubleRepo,
  assume : assume,
  verify : verify,
  createDouble : createDouble,
  repo : repo
}
