'use strict';

function popAppendingUndefinedArguments(args) {
  while (args.length > 0 && args[args.length - 1] === undefined) {
    args.pop();
  }
  return args;
}

function getArgumentsAsArray(args) {
  if (args.length === 0) {
    return undefined;
  }
  return popAppendingUndefinedArguments(Array.prototype.slice.call(args));
}

module.exports = {
  getArgumentsAsArray: getArgumentsAsArray
};
