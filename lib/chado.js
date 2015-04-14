"use strict";

function chado () {
  var createDouble = require('./testdouble').createTestDoubleFor;
  var repo = {};
  var assume = require('./assume')(repo);
  var verify = require('./verify')(repo);
  var report = require('./report');

  return  {
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
