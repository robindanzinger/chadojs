"use strict";

function track() {

  var error = new Error();
  var lines = error.stack.split('\n');
  var callerLine = lines[3];
  
  var lineRegex = /at\s(.*)\s\((.*)\:(\d*)\:(\d*)\)/;
  var result = lineRegex.exec(callerLine);

  var funcName = result[1];
  var file = result[2];
  var line = result[3];
  var index = result[4];
 
  return {file: file, line: line, index: index, func: funcName};
}

module.exports = {
  track : track
}
