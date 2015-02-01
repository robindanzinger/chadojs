var buster = require('buster'); 
var assert = buster.assert;
var refute = buster.refute;
var chadoreader = require('../lib/chadoreader');
buster.testCase("Some helper functions for the report", {
  "sort array" : function () {
    var array = createArray().addAssumption("BName").addAssumption("AName").build();
    chadoreader.sort(array);
    assert.equals(array[0].name, "AName"); 
  },
  "find a path" : function () {
    var array = createArray()
      .addAssumption("AName", "FileA", "MethodA")
      .addVerification("AName", "FileB", "MethodB")
      .addAssumption("anotherName", "FileB", "MethodB")
      .addVerification("anotherName", "FileC", "MethodC")
      .addAssumption("yetAnotherName", "FileC", "MethodC")
      .build();

    var path = chadoreader.findPath(array, array[0]);
    assert.equals(path[0], array[2]);
    assert.equals(path[1], array[4]);
  },
  "get all assumptions of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addAssumption("anotherName")
      .addAssumption("aName")
      .build();
    var assumptions = chadoreader.findAssumptions(array, array[2]);
    assert.equals(assumptions[0], array[0]);
    assert.equals(assumptions[1], array[2]);
  },
  "get all verifications of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addVerification("aName")
      .addVerification("anotherName")
      .build();
    var verifications = chadoreader.findVerifications(array, array[0]);
    assert.equals(verifications[0], array[1]);
  },
  "get all callers of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addCalledBy("anotherName")
      .addCalledBy("aName")
      .addCalledBy("aName")
      .build();
    var calledBy = chadoreader.findCalledBy(array, array[0]);
    assert.equals(calledBy[0], array[2]);
    assert.equals(calledBy[1], array[3]);
  }
});

function createArray() {
  var array = [];
  var itemsCounter = 0;

  function addAssumption(name, file, callermethod) {
    array.push(createItem(name, 'assume', file, callermethod));
    return forward();
  }

  function addVerification(name, file, callermethod) {
    array.push(createItem(name, 'verify', file, callermethod));
    return forward();
  }
  
  function addCalledBy(name) {
    array.push(createItem(name, 'calledBy'));
    return forward();
  }

  function createItem(name, type, file, callermethod, func, args, retval) {
    itemsCounter++;
    return {
      name : name,
      func : func ? func : 'func',
      args : args ? args : 'args',
      retval : retval ? retval : 'retval',
      type : type,
      file : file ? file : '/dir/file.js',
      line : 42,
      callermethod : 'callermethod' 
    }
  }

  function build() {
    return array;
  }

  function forward()
  {
    return {
      addAssumption: addAssumption,
      addVerification: addVerification,
      addCalledBy: addCalledBy,
      build: build
    }
  }

  return forward();
}


