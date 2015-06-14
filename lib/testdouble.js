'use strict';
function createTestDoubleFor(lib) {
  if (!lib || typeof lib !== 'string') {
    throw Error('lib not set or no String');
  }
  var testDouble = {};
  testDouble.chadojsNamespace = lib;
  return testDouble;
}

function getLibNameFor(testdouble) {
  if (testdouble.chadojsNamespace === undefined) {
    throw Error('Testdouble has no property "chadojsNamespace"');
  }
  return testdouble.chadojsNamespace;
}

module.exports = {
  createTestDoubleFor: createTestDoubleFor,
  getLibNameFor: getLibNameFor
};
