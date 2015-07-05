'use strict';
var parse = require('./stringify').parse;
var stringify = require('./stringify').stringify;
var parseActionString = require('./actionString').parseActionString;

function createVerificationString(assumption) {
  var action = parseActionString(assumption.action);
  return 'verify(\'' + assumption.name + '\')'
       + '.canHandle(\'' + assumption.func + '\')'
       + createArgsString(assumption.args, action)
       + createActionString(action);
}

function createArgsString(args, action) {
  if (args) {
    return '.withArgs(' + 
      convertArgsArrayToCommaSeparatedCodeString(parse(args), action)
        + ')';
  }
  return '';
}

function convertArgsArrayToCommaSeparatedCodeString(args, action) {
  return args
    .map(function (arg, index) {
      return convertToCodeString(arg, action, index); })
    .join(', ');
}

function convertToCodeString(arg, action, index) {
  if (typeof arg === 'function') {
    return replaceFunction(action, index);
  }
  var regexForFunction = /\"=>function\"/gi;
  var stringifiedArg = stringify(arg).replace(regexForFunction, 'function () {}');
  var regexForEscapedString = /\/=>function\"/gi;
  return stringifiedArg.replace(regexForEscapedString, '\"=>function\"');
}

function replaceFunction(action, index) {
  if (action && action.type === 'callback' && index === action.callbackIndex)
  {
    return 'callback';
  }
  return 'function () {}';
}

function createActionString(action) {
  if (action.type === 'returnValue') {
    return '.andReturns(' + convertToCodeString(action.value) + ').on(sut));';
  }
  if (action.type === 'throwError') {
    return '.andThrowsError(\'' + action.message + '\').on(sut));';
  }
  if (action.type === 'callback') {
    var callbackArgsAsArray = convertToCodeString(action.value);
    var callbackArgs = callbackArgsAsArray.substring(1, callbackArgsAsArray.length - 1);
    return '.andCallsCallbackWith(' + callbackArgs + ')'
      + '.on(sut, function () {}));';
  }
}

function createVerificationMethod(templates, assumption) {
  var action = parseActionString(assumption.action);
  var i = 0;
  var indent = '';
  var result = '';
    var actionvalue = action.value ? convertToCodeString(action.value) : undefined;
    var stringifiedAssumption = {
      name: assumption.name,
      func: assumption.func,
      args: '(' + convertArgsArrayToCommaSeparatedCodeString(parse(assumption.args)) + ')',
      'action.value': actionvalue ? actionvalue : undefined,
      'action.message': action.message,
      'action.cbargs': actionvalue ? actionvalue.substring(1, actionvalue.length - 1) : undefined
    };
    var methodTemplate = templates[action.type];
    while (methodTemplate['m' + i]) {
      result += indent + replaceVariables(methodTemplate['m' + i], stringifiedAssumption) + '\n';
      i++;
      indent += '  ';
    }
    result += indent + createVerificationString(assumption) + '\n';
    i--; 
    for (; i >= 0; i--) {
      indent = indent.length > 2 ? indent.substring(0, indent.length - 2) : '';
      if (methodTemplate['m' + i + 'end']){
        result += indent + replaceVariables(methodTemplate['m' + i + 'end'], stringifiedAssumption) + '\n';
      }
    }
  return result;
}

function replaceVariables(template, assumption) {
  var variables = ['name', 'func', 'args', 'action', 'action.value', 'action.message', 'action.cbargs'];
  return variables.reduce(function (text, variable){
    return text.replace('{' + variable + '}', assumption[variable]);
  }, template);  
}

module.exports = {
  createVerificationString: createVerificationString,
  createVerificationMethod: createVerificationMethod
};
