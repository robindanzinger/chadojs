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
      parse(args)
        .map(function (arg, index) {return stringifyAndReplaceFunction(arg, action, index); })
        .join(', ') + ')';
  }
  return '';
}

function stringifyAndReplaceFunction(arg, action, index) {
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
    return '.andReturns(' + stringifyAndReplaceFunction(action.value) + ').on(sut));';
  }
  if (action.type === 'throwError') {
    return '.andThrowsError(\'' + action.message + '\').on(sut));';
  }
  if (action.type === 'callback') {
    return '.andCallsCallbackWith(' + stringifyAndReplaceFunction(action.value) + ')'
      + '.on(sut, function () {}));';
  }
}

function createVerificationMethod(templates, assumption) {
  var action = parseActionString(assumption.action);
  var i = 0;
  var indent = '';
  var result = '';
    var stringifiedAssumption = {
      name: assumption.name,
      func: assumption.func,
      args: '(' + parse(assumption.args) + ')',
      'action.value': action.value ? stringifyAndReplaceFunction(action.value) : undefined,
      'action.message': action.message
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
  var variables = ['name', 'func', 'args', 'action', 'action.value', 'action.message'];
  return variables.reduce(function (text, variable){
    return text.replace('{' + variable + '}', assumption[variable]);
  }, template);  
}

module.exports = {
  createVerificationString: createVerificationString,
  createVerificationMethod: createVerificationMethod
};
