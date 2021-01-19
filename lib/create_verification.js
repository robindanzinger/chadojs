'use strict';
var parse = require('./stringify').parse;
var stringify = require('./stringify').stringify;
var parseActionString = require('./actionString').parseActionString;

function convertToCodeString(arg, action, index) {
  function replaceFunction() {
    if (action && action.type === 'callback' && index === action.callbackIndex) {
      return 'callback';
    }
    return 'function () {}';
  }

  if (typeof arg === 'function') {
    return replaceFunction(action, index);
  }
  var regexForFunction = /"=>function"/gi;
  var stringifiedArg = stringify(arg).replace(regexForFunction, 'function () {}');
  var regexForEscapedString = /\/=>function"/gi;
  return stringifiedArg.replace(regexForEscapedString, '"=>function"');
}

function convertArgsArrayToCommaSeparatedCodeString(args, action) {
  return args
    .map(function (arg, index) {
      return convertToCodeString(arg, action, index);
    })
    .join(', ');
}

function getReturnValueAsString(action) {
  return action.value && action.type === 'returnValue' ? convertToCodeString(action.value) : undefined;
}

function getCallbackArgsAsCommaSeparatedString(action) {
  return action.value && action.type === 'callback' ? convertArgsArrayToCommaSeparatedCodeString(action.value) : undefined;
}

function createVerificationString(assumption) {
  var action = parseActionString(assumption.action);

  function createActionString() {
    if (action.type === 'returnValue') {
      return '.andReturns(' + getReturnValueAsString(action) + ').on(sut));';
    }
    if (action.type === 'throwError') {
      return '.andThrowsError(\'' + action.message + '\').on(sut));';
    }
    if (action.type === 'callback') {
      return '.andCallsCallbackWith(' + getCallbackArgsAsCommaSeparatedString(action) + ')'
        + '.on(sut, function () {}));';
    }
  }

  function createArgsString() {
    if (assumption.args) {
      return '.withArgs(' +
        convertArgsArrayToCommaSeparatedCodeString(parse(assumption.args), action)
        + ')';
    }
    return '';
  }

  return 'verify(\'' + assumption.name + '\')'
    + '.canHandle(\'' + assumption.func + '\')'
    + createArgsString()
    + createActionString();
}

function createVerificationMethod(templates, assumption) {
  var action = parseActionString(assumption.action);
  var i = 0;
  var indent = '';
  var result = '';
  var stringifiedAssumption = {
    name: assumption.name,
    func: assumption.func,
    args: '(' + convertArgsArrayToCommaSeparatedCodeString(parse(assumption.args)) + ')',
    'action.value': getReturnValueAsString(action),
    'action.message': action.message,
    'action.cbargs': getCallbackArgsAsCommaSeparatedString(action)
  };
  var methodTemplate = templates[action.type];

  function replaceVariables(template) {
    var variables = ['name', 'func', 'args', 'action', 'action.value', 'action.message', 'action.cbargs'];
    return variables.reduce(function (text, variable) {
      return text.replace('{' + variable + '}', stringifiedAssumption[variable]);
    }, template);
  }

  while (methodTemplate['m' + i]) {
    result += indent + replaceVariables(methodTemplate['m' + i]) + '\n';
    i++;
    indent += '  ';
  }
  result += indent + createVerificationString(assumption) + '\n';
  i--;
  for (; i >= 0; i--) {
    indent = indent.length > 2 ? indent.substring(0, indent.length - 2) : '';
    if (methodTemplate['m' + i + 'end']) {
      result += indent + replaceVariables(methodTemplate['m' + i + 'end']) + '\n';
    }
  }
  return result;
}

module.exports = {
  createVerificationString: createVerificationString,
  createVerificationMethod: createVerificationMethod
};
