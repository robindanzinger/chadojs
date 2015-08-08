'use strict';

var expect = require('must');
var combine = require('../lib/array_combiner');
describe('combine arrays combines each element of one array with each element of another array', function () {
  it('combine one array with one element should return an array with one array with one element', function () {
    expect(combine(['A'])).to.eql([['A']]);
  });

  it('combine one array with two elements [A1,A2] should result in two arrays [[A1],[A2]]', function () {
    expect(combine(['A1', 'A2'])).to.eql([['A1'], ['A2']]);
  });

  it('combine [A] and [B] should result [[A,B]]', function () {
    var arrayA = ['A'];
    var arrayB = ['B'];
    var result = combine(arrayA, arrayB);
    expect(result).to.eql([['A', 'B']]);
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

  it('combine [A] with [B] and [C] should result in [[A, B, C]', function () {
    var arrayA = ['A'];
    var arrayB = ['B'];
    var arrayC = ['C'];
    var result = combine(arrayA, arrayB, arrayC);
    expect(result).to.eql([['A', 'B', 'C']]);
  });

  it('should ignore empty arrays', function () {
    var emptyArray = [];
    var arrayA = ['A'];
    expect(combine(arrayA, emptyArray)).to.eql([['A']]);
    expect(combine(emptyArray, arrayA)).to.eql([['A']]);
  });

  it('combine arrays with different sizes', function () {
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
