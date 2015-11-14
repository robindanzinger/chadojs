'use strict';
var findInStack = require('./find_in_stack');
var currentTestName;

function track() {
  var result = findInStack(new Error().stack.split('\n'));

  var testName = currentTestName || result[1];
  var func = result[1];
  var file = result[2];
  var line = result[3];
  var index = result[4];

  return {file: file, line: line, index: index, func: func, test: testName};
}

function setCurrentTest(testName) {
  currentTestName = testName;
}

module.exports = {
  track: track,
  setCurrentTest: setCurrentTest
};
