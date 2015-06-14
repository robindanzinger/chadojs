'use strict';

var expect = require('must');
var combine = require('../lib/array_combiner');
describe('combines different arrays', function () {
  it('combine one array with one element should return an array with one array with one element', function () {
    var array = ['A1'];
    var result = combine(array);
    expect(result[0]).to.eql(['A1']);
  });

  it('combine one array with two elements should return an array containing two arrays with each one elment', function () {
    var array = ['A1', 'A2'];
    var result = combine(array);
    expect(result[0]).to.eql(['A1']);
    expect(result[1]).to.eql(['A2']);
  });

  it('combine two arrays with each one element should return an array containing one array with both elments', function () {
    var arrayA = ['A1'];
    var arrayB = ['B1'];
    var result = combine(arrayA, arrayB);
    expect(result).to.eql([['A1', 'B1']]);
  });

  it('combine [A1, A2] with [B1] should result in [[A1, B1],[A2, B1]]', function () {
    var arrayA = ['A1', 'A2'];
    var arrayB = ['B1'];
    var result = combine(arrayA, arrayB);
    expect(result).to.eql([['A1', 'B1'],
      ['A2', 'B1']]);
  });

  it('combine [A1] with [B1,B2] should result in [[A1, B1],[A1, B2]]', function () {
    var arrayA = ['A1'];
    var arrayB = ['B1', 'B2'];
    var result = combine(arrayA, arrayB);
    expect(result).to.eql([['A1', 'B1'], ['A1', 'B2']]);
  });

  it('combine three arrays', function () {
    var arrayA = ['A1'];
    var arrayB = ['B1'];
    var arrayC = ['C1'];
    var result = combine(arrayA, arrayB, arrayC);
    expect(result).to.eql([['A1', 'B1', 'C1']]);
  });

  it('empty array should be ignored', function () {
    var emptyArray = [];
    var arrayA = ['A1'];
    expect(combine(arrayA, emptyArray)).to.eql([['A1']]);
    expect(combine(emptyArray, arrayA)).to.eql([['A1']]);
  });

  it('combine different paths', function () {
    var pathA = ['A1', 'A2'];
    var pathB = ['B1'];
    var pathC = ['C1', 'C2', 'C3'];
    var result = combine(pathA, pathB, pathC);
    expect(result).to.eql(
      [
        ['A1', 'B1', 'C1'],
        ['A1', 'B1', 'C2'],
        ['A1', 'B1', 'C3'],
        ['A2', 'B1', 'C1'],
        ['A2', 'B1', 'C2'],
        ['A2', 'B1', 'C3']
      ]);
  });
});
