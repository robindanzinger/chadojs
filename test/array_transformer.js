'use strict';

var expect = require('must');
var transform = require('../lib/array_transformer');
describe('Chado Object Keys to Array Transformer', function () {
  describe('It transforms the json map to an array', function () {
    it('{} should result in []', function () {
      expect(transform({})).to.eql([]);
    });

    it('{A:{}} should result in [{1:A}]', function () {
      expect(transform({A: {}})).to.eql([{1: 'A'}]);
    });

    it('{A:{},B:{}} should result in [{1:A},{1:B}]', function () {
      expect(transform({A: {}, B: {}})).to.eql([{1: 'A'}, {1: 'B'}]);
    });

    it('{A:{B:{}}} should result in [{1:A,2:B}]', function () {
      expect(transform({A: {B: {}}})).to.eql([{1: 'A', 2: 'B'}]);
    });

    it('{A:{B:{C:{}}}} should result in [{1:A,2:B,3:C}]', function () {
      expect(transform({A: {B: {C: {}}}})).to.eql([{1: 'A', 2: 'B', 3: 'C'}]);
    });

    it('{A:{C:{}}} should result in [{1:A,2:C}]', function () {
      expect(transform({A: {C: {}}})).to.eql([{1: 'A', 2: 'C'}]);
    });

    it('{A:{B:{}, C:{}}} should result in two objects A->B and A->C', function () {
      var array = transform({A: {B: {}, C: {}}});
      expect(array).to.have.length(2);
    });

    it('can define a value parser', function () {
      var parser = function (value) { return '<' + value + '>'; };
      var result = transform({A: {B: {}}}, ['KEY1', 'KEY2'], {'KEY2': parser});
      expect(result).to.eql([{'KEY1': 'A', 'KEY2': '<B>'}]);
    });

    it('complex example', function () {
      this.json = {
        ObjectA: {Method1: {'["Arg1"]': {ReturnVal1: {'assume': {'path1': {'14': {'CallerFuncA': {}}}}}}}},
        ObjectB: {
          Method1: {
            '["Arg1"]': {
              ReturnVal1: {
                'assume': {'path2': {'14': {'CallerFuncB': {}}}},
                'verify': {'path2b': {'42': {'CallerFuncB2': {}}}}
              }
            }
          }
        },
        ObjectC: {
          Method1: {
            '["Arg1"]': {ReturnVal1: {'assume': {'path3': {'14': {'CallerFuncC1': {}}}}}},
            '["Arg2""]': {ReturnVal1: {'assume': {'path4': {'17': {'CallerFuncC2': {}}}}}}
          }
        }
      };
      expect(transform(this.json)).to.have.length(5);
    });

    it('can set names instead of index', function () {
      expect(transform({A: {B: {}}, C: {}}, ['KEY1', 'KEY2'])).to.eql([{'KEY1': 'A', 'KEY2': 'B'}, {'KEY1': 'C'}]);
    });
  });
});

