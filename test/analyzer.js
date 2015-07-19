'use strict';

var expect = require('must');
var analyzer = require('../lib/analyzer');
describe('Some functions for analyzing the made assumptions', function () {
  it('sort array', function () {
    var array = createArray().addAssumption('BName').addAssumption('AName').build();
    analyzer.sort(array);
    expect('AName').to.be(array[0].name);
  });

  it('find a path', function () {
    var array = createArray()
      .addAssumption('AName', 'FileA', 'TestA')
      .addVerification('AName', 'FileB', 'TestB')
      .addAssumption('anotherName', 'FileB', 'TestB')
      .addVerification('anotherName', 'FileC', 'TestC')
      .addAssumption('yetAnotherName', 'FileC', 'TestC')
      .build();

    var paths = analyzer.findPaths(array, array[0]);
    expect(array[2]).to.be(paths[0][0]);
    expect(array[4]).to.be(paths[0][1]);
    expect(paths.length).to.be(1);
  });

  it('find a path with two different ways', function () {
    var array = createArray()
      .addAssumption('AName', 'FileA', 'TestA')
      .addVerification('AName', 'FileB', 'TestB')
      .addAssumption('path1Name1', 'FileB', 'TestB')
      .addVerification('path1Name1', 'FileD', 'TestD')
      .addAssumption('path1Name2', 'FileD', 'TestD')
      .addVerification('AName', 'FileC', 'TestC')
      .addAssumption('path2Name1', 'FileC', 'TestC')
      .addVerification('path2Name1', 'FileE', 'TestE')
      .addAssumption('path2Name2', 'FileE', 'TestE')
      .build();

    var paths = analyzer.findPaths(array, array[0]);
    expect(array[2]).to.be(paths[0][0]);
    expect(array[4]).to.be(paths[0][1]);
    expect(array[6]).to.be(paths[1][0]);
    expect(array[8]).to.be(paths[1][1]);
  });

  it('find a path with different several assumptions, should return one path', function () {
    var array = createArray()
      .addAssumption('AName', 'FileA', 'TestA')
      .addVerification('AName', 'FileB', 'TestB')
      .addAssumption('Assumption1', 'FileB', 'TestB')
      .addAssumption('Assumption2', 'FileB', 'TestB')
      .build();

    var paths = analyzer.findPaths(array, array[0]);
    expect(paths).to.have.length(1);
    expect(array[2]).to.be(paths[0][0]);
    expect(array[3]).to.be(paths[0][1]);
  });

  it('get all assumptions of an assumption', function () {
    var array = createArray()
      .addAssumption('aName')
      .addAssumption('anotherName')
      .addAssumption('aName')
      .build();
    var assumptions = analyzer.findAssumptions(array, array[2]);
    expect(assumptions).to.have.length(2);
    expect(array[0]).to.be(assumptions[0]);
    expect(array[2]).to.be(assumptions[1]);
  });

  it('get all verifications of an assumption', function () {
    var array = createArray()
      .addAssumption('aName')
      .addVerification('aName')
      .addVerification('anotherName')
      .build();
    var verifications = analyzer.findVerifications(array, array[0]);
    expect(verifications).to.have.length(1);
    expect(array[1]).to.be(verifications[0]);
  });

  it('get all callers of an assumption', function () {
    var array = createArray()
      .addAssumption('aName')
      .addCalledBy('anotherName')
      .addCalledBy('aName')
      .addCalledBy('aName')
      .build();
    var calledBy = analyzer.findCalledBy(array, array[0]);
    expect(calledBy).to.have.length(2);
    expect(array[2]).to.be(calledBy[0]);
    expect(array[3]).to.be(calledBy[1]);
  });

  it('get all types of an assumption', function () {
    var array = createArray()
      .addAssumption('A')
      .addAssumption('B')
      .addVerification('A')
      .addVerification('C')
      .addCalledBy('A')
      .addCalledBy('D')
      .build();
    analyzer.sort(array);
    var groupedArray = analyzer.groupAssumptions(array);
    expect(groupedArray).to.have.length(4);
  });

  it('get all not verified assumptions', function () {
    var array = createArray()
      .addAssumption('A')
      .addVerification('A')
      .addAssumption('B')
      .build();
    var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(array);
    expect(notVerifiedAssumptions).to.have.length(1);
    expect(notVerifiedAssumptions[0].name).to.be('B');
  });

  it('get all not assumed verifications', function () {
    var array = createArray()
      .addAssumption('A')
      .addVerification('A')
      .addVerification('B')
      .build();
    var notAssumedVerifications = analyzer.getNotAssumedVerifications(array);
    expect(notAssumedVerifications).to.have.length(1);
    expect(notAssumedVerifications[0].name).to.be('B');
  });

  it('get all assumptions', function () {
    var array = createArray()
      .addAssumption('A')
      .addAssumption('B')
      .addVerification('C')
      .build();
    var allAssumptions = analyzer.getAllAssumptions(array);
    expect(allAssumptions).to.have.length(2);
  });
  it('get all verifications', function () {
    var array = createArray()
      .addAssumption('A')
      .addAssumption('B')
      .addVerification('C')
      .addVerification('A')
      .build();
    var allVerifications = analyzer.getAllVerifications(array);
    expect(allVerifications).to.have.length(2);
  });
});

function createArray() {
  var array = [];

  function addAssumption(name, file, test) {
    array.push(createItem(name, 'assume', file, test));
    return forward();
  }

  function addVerification(name, file, test) {
    array.push(createItem(name, 'verify', file, test));
    return forward();
  }

  function addCalledBy(name) {
    array.push(createItem(name, 'calledBy'));
    return forward();
  }

  function createItem(name, type, file, test, func, args, retval) {
    return {
      name: name,
      func: func ? func : 'func',
      args: args ? args : 'args',
      retval: retval ? retval : 'retval',
      type: type,
      file: file ? file : '/dir/file.js',
      line: 42,
      test: 'testname'
    };
  }

  function build() {
    return array;
  }

  function forward() {
    return {
      addAssumption: addAssumption,
      addVerification: addVerification,
      addCalledBy: addCalledBy,
      build: build
    };
  }

  return forward();
}


