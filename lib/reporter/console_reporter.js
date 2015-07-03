'use strict';
var analyzer = require('../analyzer');
var repo;

/* istanbul ignore next */
function logReport() {
  var assumptionArray = analyzer.read(repo);
  var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(assumptionArray);
  var notAssumedVerifications = analyzer.getNotAssumedVerifications(assumptionArray);
  var allAssumptions = analyzer.getAllAssumptions(assumptionArray);
  var allVerifications = analyzer.getAllVerifications(assumptionArray);
  console.log('');
  console.log('======================');
  console.log('CHADO CONSOLE REPORTER');
  console.log('======================');
  console.log('');
  if (notVerifiedAssumptions.length > 0) {
    console.log('');
    console.log('WARNING: some assumptions aren\'t verified');
    console.log('-----------------------------------------');
    notVerifiedAssumptions.forEach(function (assumption) {
      console.log('  ' + assumption.name + '.' + assumption.func + '(' + assumption.args + ') => ' + assumption.action);
    });
  } else {
    console.log('');
    console.log('All ' + allAssumptions.length + ' assumptions are verified');
  } 
  console.log('');
  console.log('------------------------------------------');
  if (notAssumedVerifications.length > 0) {
    console.log('');
    console.log('WARNING: some verifications aren\'t assumed');
    console.log('------------------------------------------');
    notAssumedVerifications.forEach(function (verification) {
    console.log('  ' + verification.name + '.' + verification.func + '(' + verification.args + ') => ' + verification.action);
    });
  } else {
    console.log('');
    console.log('All ' + allVerifications.length + ' verifications are assumed');
  }
  console.log('');
  console.log('------------------------------------------');
}

function create(nRepo) {
  repo = nRepo;
  return {logReport : logReport};
}

module.exports = create
