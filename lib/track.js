'use strict';

var currentTestName;

function track() {
  var error = new Error();
  var lines = error.stack.split('\n');
  var callerLine = lines[3];

  var lineRegex = /at\s(.*)\s\((.*)\:(\d*)\:(\d*)\)/;
  var result = lineRegex.exec(callerLine) || [];

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
