var buster = require('buster'); 
var assert = buster.assert;
var refute = buster.refute;
var combine = require('../lib/array_combiner');
buster.testCase("combines different arrays", {
  "combine one array with one element should return an array with one array with one element" : function () {
    var array = ['A1'];
    var result = combine(array);
    assert.equals(['A1'], result[0]);
  },
  "combine one array with two elements should return an array containing two arrays with each one elment" : function () {
    var array = ['A1', 'A2'];
    var result = combine(array);
    assert.equals(['A1'], result[0]);
    assert.equals(['A2'], result[1]);
  }, 
  "combine two arrays with each one element should return an array containing one array with both elments" : function () {
    var arrayA = ['A1'];
    var arrayB = ['B1'];
    var result = combine(arrayA, arrayB);
    assert.equals([['A1', 'B1']], result);
  }, 
  "combine [A1, A2] with [B1] should result in [[A1, B1],[A2, B1]]" : function () { 
    var arrayA = ['A1', 'A2'];
    var arrayB = ['B1'];
    var result = combine(arrayA, arrayB);
    assert.equals([['A1', 'B1'], ['A2', 'B1']], result);
  }, 
  "combine [A1] with [B1,B2] should result in [[A1, B1],[A1, B2]]" : function () { 
    var arrayA = ['A1'];
    var arrayB = ['B1', 'B2'];
    var result = combine(arrayA, arrayB);
    assert.equals([['A1', 'B1'], ['A1', 'B2']], result);
  }, 
  "combine three arrays" : function () { 
    var arrayA = ['A1'];
    var arrayB = ['B1'];
    var arrayC = ['C1'];
    var result = combine(arrayA, arrayB, arrayC);
    assert.equals([['A1', 'B1', 'C1']], result);
  }, 
  "empty array should be ignored" : function () {
    var emptyArray = [];
    var arrayA = ['A1'];
    assert.equals([['A1']], combine(emptyArray, arrayA));
    assert.equals([['A1']], combine(arrayA, emptyArray));
  },
  "combine different paths" : function () {
    var pathA = ['A1', 'A2'];
    var pathB = ['B1'];
    var pathC = ['C1', 'C2', 'C3'];

    var result = combine(pathA);

    assert([['A1','B1','C1'],
            ['A1','B1','C2'],
            ['A1','B1','C3'],
            ['A2','B1','C1'],
            ['A2','B1','C2'],
            ['A2','B1','C3']], 
            combine(pathA, pathB, pathC));
  }
});
