var expect = require('must');
var analyzer = require('../lib/analyzer');
describe("Some functions for analyzing the made assumptions", function () {
  it('sort array', function () {
    var array = createArray().addAssumption("BName").addAssumption("AName").build();
    analyzer.sort(array);
    expect("AName").equal(array[0].name); 
  }),
  it('find a path', function () {
    var array = createArray()
      .addAssumption("AName", "FileA", "MethodA")
      .addVerification("AName", "FileB", "MethodB")
      .addAssumption("anotherName", "FileB", "MethodB")
      .addVerification("anotherName", "FileC", "MethodC")
      .addAssumption("yetAnotherName", "FileC", "MethodC")
      .build();

    var paths = analyzer.findPaths(array, array[0]);
    expect(array[2]).equal(paths[0][0]);
    expect(array[4]).equal(paths[0][1]);
    expect(paths.length).equal(1);
  }),
  it('find a path with two different ways', function () {
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
    expect(array[2]).equal(paths[0][0]);
    expect(array[4]).equal(paths[0][1]);
    expect(array[6]).equal(paths[1][0]);
    expect(array[8]).equal(paths[1][1]);
  }),
  it('find a path with different several assumptions, should return one path', function () {
    var array = createArray()
      .addAssumption("AName", "FileA", "MethodA")
      .addVerification("AName", "FileB", "MethodB")
      .addAssumption("Assumption1", "FileB", "MethodB")
      .addAssumption("Assumption2", "FileB", "MethodB")
     .build();

    var paths = analyzer.findPaths(array, array[0]);
    expect(paths.length).equal(1);
    expect(array[2]).equal(paths[0][0]);
    expect(array[3]).equal(paths[0][1]);
  }),
  it('get all assumptions of an assumption', function () {
    var array = createArray()
      .addAssumption("aName")
      .addAssumption("anotherName")
      .addAssumption("aName")
      .build();
    var assumptions = analyzer.findAssumptions(array, array[2]);
    expect(assumptions.length).equal(2);
    expect(array[0]).equal(assumptions[0]);
    expect(array[2]).equal(assumptions[1]);
  }),
  it('get all verifications of an assumption', function () {
    var array = createArray()
      .addAssumption("aName")
      .addVerification("aName")
      .addVerification("anotherName")
      .build();
    var verifications = analyzer.findVerifications(array, array[0]);
    expect(verifications.length).equal(1);
    expect(array[1]).equal(verifications[0]);
  }),
  it('get all callers of an assumption', function () {
    var array = createArray()
      .addAssumption("aName")
      .addCalledBy("anotherName")
      .addCalledBy("aName")
      .addCalledBy("aName")
      .build();
    var calledBy = analyzer.findCalledBy(array, array[0]);
    expect(calledBy.length).equal(2);
    expect(array[2]).equal(calledBy[0]);
    expect(array[3]).equal(calledBy[1]);
  }),
  it('get all types of an assumption', function () {
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
    expect(4).equal(groupedArray.length);
  }),
  it('get all not verified assumptions', function () {
    var array = createArray()
      .addAssumption("A")
      .addVerification("A")
      .addAssumption("B")
      .build();
    var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(array);
    expect(1).equal(notVerifiedAssumptions.length);
    expect("B").equal(notVerifiedAssumptions[0].name);
  }),
  it('get all not assumed verifications', function () {
    var array = createArray()
      .addAssumption("A")
      .addVerification("A")
      .addVerification("B")
      .build();
    var notAssumedVerifications = analyzer.getNotAssumedVerifications(array);
    expect(1).equal(notAssumedVerifications.length);
    expect("B").equal(notAssumedVerifications[0].name);
  })
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


