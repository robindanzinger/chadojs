"use strict";

var transform = require('./arraytransformer');
var fs = require('fs');

function read(file) {
  var json = JSON.parse(fs.readFileSync(file));
  var array = transform(json, ["name", "func", "args", "action", "type", "file", "line", "callermethod"]);
  return sort(array);
}

function sort(array) {
  var props = ['name', 'func', 'args', 'action', 'type'];
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
        && elem.action == assumption.action;   
  });
}

function findAssumptionsForVerification(verification, array) {
  return array.filter(function(elem) {
    return elem.type == 'assume' 
        && elem.file == verification.file 
        && elem.callermethod == verification.callermethod;  
  });
}

function groupAssumptions(array) {
  var result = [];
  var group;

  function createNewGroup (element) {
    group = {
      name: element.name,
      func: element.func,
      args: element.args,
      action: element.action,
      id: element.id
    };
    group[element.type] = true;
    result.push(group);
  }

  function addToGroup (element) {
    group[element.type] = true; 
  }

  function belongsToGroup(element) {
    return group.name == element.name 
      && group.func == element.func
      && group.args == element.args
      && group.action == element.action;
  }

  array.forEach(function (element) {
    if (group && belongsToGroup(element)) {
      addToGroup(element);
    } else {
      createNewGroup(element);
    }
  });

  return result;
}

module.exports = {
  read : read,
  sort : sort,
  findPath : find,
  findAssumptions : findAssumptions,
  findVerifications : findVerifications,
  findCalledBy : findCalledBy,
  groupAssumptions : groupAssumptions
}
