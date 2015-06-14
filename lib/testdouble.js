'use strict';
function createTestDoubleFor(lib) {
  if (!lib || typeof lib !== 'string') {
    throw Error('lib not set or no String');
  }
  var testDouble = {};
  testDouble._chadojs_namespace = lib;
  return testDouble;
}

function getLibNameFor(testdouble) {
  if (testdouble._chadojs_namespace === undefined) {
    throw Error('Testdouble has no property "_chadojs_namespace"');
  }
  return testdouble._chadojs_namespace;
}

module.exports = {
  createTestDoubleFor: createTestDoubleFor,
  getLibNameFor: getLibNameFor
};
