'use strict';

function findInStack(linesOfStacktrace) {
  var callerLine = linesOfStacktrace[3];
  var result = /at\s(.*)\s\((.*)\:(\d*)\:(\d*)\)/.exec(callerLine);
  if (!result) {
    result = /()at\s(.*)\:(\d*)\:(\d*)/.exec(callerLine) || [];
  }
  return result;
}

module.exports = findInStack;
