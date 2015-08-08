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
    
    it('{A:{B:{}, C:{}}} should result in two objects [{1:A,2:B},{1:A,2:C}', function () {
      expect(transform({A: {B: {}, C: {}}})).to.eql([{1: 'A', 2: 'B'}, {1: 'A', 2: 'C'}]);
    });
    
    it('can define custom keys instead of index so that {A:{}} with key \'KEY\' result in [{KEY:A}]', function () {
      expect(transform({A: {}}, ['KEY'])).to.eql([{'KEY': 'A'}]);
    });
    
    it('can mix custom key and index', function () {
      expect(transform({A: {B: {C: {}}}, D: {}}, ['KEY1', 'KEY2'])).to.eql([{'KEY1': 'A', 'KEY2': 'B', 3: 'C'}, {'KEY1': 'D'}]);
    });
    
    it('can define a value parser for each key so that {A:{}} results in [{1:A*}], where A* is the parsed value of A', function () {
      var parser = function (value) { return value + '*'; };
      var result = transform({A: {}}, undefined, {1: parser});
      expect(result).to.eql([{'1': 'A*'}]);
    });
    
    it('can define a value parser for each custom key', function () {
      var parser = function (value) { return '<' + value + '>'; };
      var result = transform({A: {B: {}}}, ['KEY1', 'KEY2'], {'KEY2': parser});
      expect(result).to.eql([{'KEY1': 'A', 'KEY2': '<B>'}]);
    });
    
    it('complex example', function () {
      this.json = {
        ObjectA: {
          Method1: {
            '["Arg1"]': {
              ReturnVal1: {'assume': {'path1': {'14': {'CallerFuncA': {}}}}}
            }
          }
        },
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
  });
});

