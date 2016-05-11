'use strict';
var transform = require('./array_transformer');
var makeHumanReadableActionString = require('./actionString').makeHumanReadableActionString;
var combine = require('./array_combiner');

function sort(array) {
  var props = ['name', 'func', 'args', 'action', 'type'];
  return array.sort(function (lhs, rhs) {
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

function read(json) {
  delete json.originals;
  var parseArgsString = function (value) {
    if (value === 'undefined') {
      return '';
    }
    return value.substring(1, value.length - 1);
  };
  var keyNames = ['name', 'func', 'args', 'action', 'type', 'file', 'line', 'callermethod', 'test'];
  var valueParser = {'args': parseArgsString, 'action': makeHumanReadableActionString};
  var array = transform(json, keyNames, valueParser);
  return sort(array);
}

function filterByType(array, assumption, type) {
  return array.filter(function (elem) {
    return elem.type === type
      && elem.name === assumption.name
      && elem.func === assumption.func
      && elem.args === assumption.args
      && elem.action === assumption.action;
  });
}

function findVerifications(array, assumption) {
  return filterByType(array, assumption, 'verify');
}

function findAssumptionsForVerification(verification, array) {
  return array.filter(function (elem) {
    return elem.type === 'assume'
      && elem.file === verification.file
      && elem.test === verification.test;
  });
}

function findPaths(array, start, traversedElements) {
  var result = [];
  findVerifications(array, start).forEach(function (verification) {
    var pathsForOneVerification = [];
    findAssumptionsForVerification(verification, array).filter(function (assumption) {
      return traversedElements.indexOf(assumption) === -1;
    }).forEach(function (assumption) {
      traversedElements.push(assumption);
      var subpaths = findPaths(array, assumption, traversedElements);
      pathsForOneVerification = combine(pathsForOneVerification, [assumption], subpaths);
    });
    pathsForOneVerification.forEach(function (path) {
      result.push(path);
    });
  });
  return result;
}

function find(array, start) {
  return findPaths(array, start, []);
}

function findAssumptions(array, assumption) {
  return filterByType(array, assumption, 'assume');
}

function findCalledBy(array, assumption) {
  return filterByType(array, assumption, 'calledBy');
}

function groupAssumptions(array) {
  var result = [];
  var group;

  function createNewGroup(element) {
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

  function addToGroup(element) {
    group[element.type] = true;
  }

  function belongsToGroup(element) {
    return group.name === element.name
      && group.func === element.func
      && group.args === element.args
      && group.action === element.action;
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

function getNotVerifiedAssumptions(array) {
  return groupAssumptions(array).filter(function (group) { return group.verify !== true && group.assume === true; });
}

function getNotAssumedVerifications(array) {
  return groupAssumptions(array).filter(function (group) { return group.verify === true && group.assume !== true; });
}

function getUnusedAssumptions(array) {
  return groupAssumptions(array).filter(function (group) { return group.assume === true && group.calledBy !== true; });
}

function getAllAssumptions(array) {
  return groupAssumptions(array).filter(function (group) { return group.assume === true; });
}

function getAllVerifications(array) {
  return groupAssumptions(array).filter(function (group) { return group.verify === true; });
}

module.exports = {
  read: read,
  sort: sort,
  findPaths: find,
  findAssumptions: findAssumptions,
  findVerifications: findVerifications,
  findCalledBy: findCalledBy,
  groupAssumptions: groupAssumptions,
  getNotVerifiedAssumptions: getNotVerifiedAssumptions,
  getNotAssumedVerifications: getNotAssumedVerifications,
  getAllAssumptions: getAllAssumptions,
  getAllVerifications: getAllVerifications,
  getUnusedAssumptions: getUnusedAssumptions
};
