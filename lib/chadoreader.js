"use strict";

var transform = require('./arraytransformer');
var fs = require('fs');

function read(file) {
  var json = JSON.parse(fs.readFileSync(file));
  return transform(json, ["name", "func", "args", "retval", "type", "file", "line", "callermethod"]);
}

function sort(array) {
  var props = ['name', 'func', 'args', 'retval', 'type'];
  return array.sort(function(lhs, rhs) {
    for (var i = 0; i < props.length; i++) {
      if (lhs[props[i]] > rhs[props[i]]) {
        return 1;
      }
      if (lhs[props[i]] < rhs[props[i]]) {
        return -1;
      }
    }
    return 0;
  });
}

function find(array, start) {
  return findPath(array, start, []);
}

function findPath(array, start, traversedElements) {
  var result = [];
  var verifications = findVerifications(array, start);
  verifications.forEach(function (verification) {
    var assumptions = findAssumptionsForVerification(verification, array);
    assumptions.forEach(function (assumption) {
      if (traversedElements.indexOf(assumption) == -1) {
        traversedElements.push(assumption); 
        result.push(assumption);
        result = result.concat(findPath(array, assumption, traversedElements));
      }
    });
  });
  return result;
}

function findVerifications(array, assumption) {
  return filterByType(array, assumption, 'verify');
}

function findAssumptions(array, assumption) {
  return filterByType(array, assumption, 'assume');
}

function findCalledBy(array, assumption) {
  return filterByType(array, assumption, 'calledBy');
}

function filterByType(array, assumption, type) {
  return array.filter(function (elem) {
     return elem.type == type 
        && elem.name == assumption.name 
        && elem.func == assumption.func 
        && elem.args == assumption.args 
        && elem.retval == assumption.retval;   
  });
}

function findAssumptionsForVerification(verification, array) {
  return array.filter(function(elem) {
    return elem.type == 'assume' 
        && elem.file == verification.file 
        && elem.callermethod == verification.callermethod;  
  });
}

module.exports = {
  read : read,
  sort : sort,
  findPath : find,
  findAssumptions : findAssumptions,
  findVerifications : findVerifications,
  findCalledBy : findCalledBy
}
