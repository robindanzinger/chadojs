'use strict';

var expect = require('must');
var combine = require('../lib/array_combiner');
describe('array_combiner builds matrices by combining each element with each of the others', function () {
  it('combine one array with one element should return an array with one array with one element', function () {
    expect(combine(['A'])).to.eql([['A']]);
  });

  it('combine one array with two elements [A1,A2] should result in two arrays [[A1],[A2]]', function () {
    expect(combine(['A1', 'A2'])).to.eql([['A1'], ['A2']]);
  });

  it('combine [A] and [B] should result [[A,B]]', function () {
    expect(combine(['A'], ['B'])).to.eql([['A', 'B']]);
  });

  it('combine [A1, A2] with [B1] should result in [[A1, B1],[A2, B1]]', function () {
    expect(combine(['A1', 'A2'], ['B1'])).to.eql([['A1', 'B1'], ['A2', 'B1']]);
  });

  it('combine [A1] with [B1,B2] should result in [[A1, B1],[A1, B2]]', function () {
    expect(combine(['A1'], ['B1', 'B2'])).to.eql([['A1', 'B1'], ['A1', 'B2']]);
  });

  it('combine [A] with [B] and [C] should result in [[A, B, C]', function () {
    expect(combine(['A'], ['B'], ['C'])).to.eql([['A', 'B', 'C']]);
  });

  it('should ignore empty arrays', function () {
    expect(combine(['A'], [])).to.eql([['A']]);
    expect(combine([], ['A'])).to.eql([['A']]);
  });

  it('combine arrays with different sizes', function () {
    expect(combine(['A1', 'A2'], ['B1'], ['C1', 'C2', 'C3'])).to.eql(
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
