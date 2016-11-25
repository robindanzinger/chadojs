'use strict';

function popAppendingUndefinedArguments(args) {
  while (args.length > 0 && args[args.length - 1] === undefined) {
    args.pop();
  }
  return args;
}

function getArgumentsAsArray(args, fromIndex) {
  if (args === undefined || args.length === 0) {
    return [];
  }
  return popAppendingUndefinedArguments(Array.prototype.slice.call(args, fromIndex));
}

module.exports = {
  getArgumentsAsArray: getArgumentsAsArray
};
