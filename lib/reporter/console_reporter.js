"use strict";
var analyzer = require('../analyzer');
var repo;

function logReport() {
  var assumptionArray = analyzer.read(repo);
  var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(assumptionArray) ;
  var notAssumedVerifications = analyzer.getNotAssumedVerifications(assumptionArray);
  console.log("");
  console.log("======================");
  console.log("CHADO CONSOLE REPORTER");
  console.log("======================");
  console.log("");
  if (notVerifiedAssumptions.length > 0) {
    console.log("WARNING: some assumptions aren't verified");
    console.log("-----------------------------------------------");
    notVerifiedAssumptions.forEach(function (assumption) {
      console.log("  " + assumption.name + '.' + assumption.func + '(' + assumption.args + ') => ' + assumption.action);
    });
    console.log("");
    console.log("-----------------------------------------------");
  }
  if (notAssumedVerifications.length > 0) {
    console.log("WARNING: some assumptions are verified but never assumed");
    console.log("--------------------------------------------------------------");
    notAssumedVerifications.forEach(function (assumption) {
    console.log("  " + assumption.name + '.' + assumption.func + '(' + assumption.args + ') => ' + assumption.action);
    });
    console.log("");
    console.log("--------------------------------------------------------------");
  } 
}

function create(nRepo) {
  repo = nRepo;
  return {logReport : logReport};
}

module.exports = create
