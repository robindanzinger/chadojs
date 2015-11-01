'use strict';

var globalDoubles = [];

function createDouble(name, existingObject) {
  if (!name || typeof name !== 'string') {
    throw new Error('name not set or not a String');
  }
  var double = existingObject || {};
  double.chadojsNamespace = name;
  double.chadojsBackup = {};
  globalDoubles.push(double);
  return double;
}

function nameFor(double) {
  if (!double.chadojsNamespace) {
    throw new Error('Testdouble has no property "chadojsNamespace"');
  }
  return double.chadojsNamespace;
}

function resetAllDoubles () {
  globalDoubles.forEach(function (double) {
    Object.keys(double.chadojsBackup).forEach(function (functionName) {
      double[functionName] = double.chadojsBackup[functionName];
    });
    delete double.chadojsNamespace;
    delete double.chadojsBackup;
  });
  globalDoubles = [];
}

module.exports = {
  createDouble: createDouble,
  nameFor: nameFor,
  resetAllDoubles: resetAllDoubles
};
