var buster = require('buster'); 
var assert = buster.assert;
var refute = buster.refute;
var analyzer = require('../lib/analyzer');
buster.testCase("Some functions for analyzing the made assumptions", {
  "sort array" : function () {
    var array = createArray().addAssumption("BName").addAssumption("AName").build();
    analyzer.sort(array);
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

    var paths = analyzer.findPaths(array, array[0]);
    assert.equals(paths[0][0], array[2]);
    assert.equals(paths[0][1], array[4]);
    assert.equals(1, paths.length);
  },
  "find a path with two different ways" : function () {
    var array = createArray()
      .addAssumption("AName", "FileA", "MethodA")
      .addVerification("AName", "FileB", "MethodB")
      .addAssumption("path1Name1", "FileB", "MethodB")
      .addVerification("path1Name1", "FileD", "MethodD")
      .addAssumption("path1Name2", "FileD", "MethodD")
      .addVerification("AName", "FileC", "MethodC")
      .addAssumption("path2Name1", "FileC", "MethodC")
      .addVerification("path2Name1", "FileE", "MethodE")
      .addAssumption("path2Name2", "FileE", "MethodE")
     .build();

    var paths = analyzer.findPaths(array, array[0]);
    assert.equals(paths[0][0], array[2]);
    assert.equals(paths[0][1], array[4]);
    assert.equals(paths[1][0], array[6]);
    assert.equals(paths[1][1], array[8]);
  },
  "find a path with different several assumptions, should return one path" : function () {
    var array = createArray()
      .addAssumption("AName", "FileA", "MethodA")
      .addVerification("AName", "FileB", "MethodB")
      .addAssumption("Assumption1", "FileB", "MethodB")
      .addAssumption("Assumption2", "FileB", "MethodB")
     .build();

    var paths = analyzer.findPaths(array, array[0]);
    assert.equals(1, paths.length);
    assert.equals(paths[0][0], array[2]);
    assert.equals(paths[0][1], array[3]);
  },
  "get all assumptions of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addAssumption("anotherName")
      .addAssumption("aName")
      .build();
    var assumptions = analyzer.findAssumptions(array, array[2]);
    assert.equals(2, assumptions.length);
    assert.equals(assumptions[0], array[0]);
    assert.equals(assumptions[1], array[2]);
  },
  "get all verifications of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addVerification("aName")
      .addVerification("anotherName")
      .build();
    var verifications = analyzer.findVerifications(array, array[0]);
    assert.equals(1, verifications.length);
    assert.equals(verifications[0], array[1]);
  },
  "get all callers of an assumption" : function () {
    var array = createArray()
      .addAssumption("aName")
      .addCalledBy("anotherName")
      .addCalledBy("aName")
      .addCalledBy("aName")
      .build();
    var calledBy = analyzer.findCalledBy(array, array[0]);
    assert.equals(2, calledBy.length);
    assert.equals(calledBy[0], array[2]);
    assert.equals(calledBy[1], array[3]);
  },
  "get all types of an assumption" : function () {
    var array = createArray()
      .addAssumption("A")
      .addAssumption("B")
      .addVerification("A")
      .addVerification("C")
      .addCalledBy("A")
      .addCalledBy("D")
      .build();
    analyzer.sort(array);
    var groupedArray = analyzer.groupAssumptions(array);
    assert.equals(groupedArray.length, 4);
  },
  "get all not verified assumptions" : function () {
    var array = createArray()
      .addAssumption("A")
      .addVerification("A")
      .addAssumption("B")
      .build();
    var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(array);
    assert.equals(notVerifiedAssumptions.length, 1);
    assert.equals(notVerifiedAssumptions[0].name, "B");
  },
  "get all not assumed verifications" : function () {
    var array = createArray()
      .addAssumption("A")
      .addVerification("A")
      .addVerification("B")
      .build();
    var notAssumedVerifications = analyzer.getNotAssumedVerifications(array);
    assert.equals(notAssumedVerifications.length, 1);
    assert.equals(notAssumedVerifications[0].name, "B");
  }
});

function createArray() {
  var array = [];

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


