'use strict';

var testDoubles = [];

function createTestDoubleFor(libName, optionalLib) {
  if (!libName || typeof libName !== 'string') {
    throw Error('libName not set or no String');
  }
  var testDouble = optionalLib || {};
  testDouble.chadojsNamespace = libName;
  testDouble.chadojsBackup = {};
  testDoubles.push(testDouble);
  return testDouble;
}

function getLibNameFor(testdouble) {
  if (testdouble.chadojsNamespace === undefined) {
    throw Error('Testdouble has no property "chadojsNamespace"');
  }
  return testdouble.chadojsNamespace;
}

function resetTestDoubles () {
  testDoubles.forEach(function (testDouble) {
    Object.keys(testDouble.chadojsBackup).forEach(function (functionName) {
      testDouble[functionName] = testDouble.chadojsBackup[functionName];
    });
    delete testDouble.chadojsNamespace;
    delete testDouble.chadojsBackup;
  });
  testDoubles = [];
}

module.exports = {
  createTestDoubleFor: createTestDoubleFor,
  getLibNameFor: getLibNameFor,
  resetTestDoubles: resetTestDoubles
};
