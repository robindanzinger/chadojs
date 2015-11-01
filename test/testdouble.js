'use strict';

var expect = require('must');
var testDoubleLib = require('../lib/testdouble');

describe('Library "testdouble"', function () {

  var createDouble = testDoubleLib.createDouble;
  
  describe('Function "createDouble"', function () {
    it('should throw error, if called without lib name', function () {
      function func() {
        createDouble();
      };
      expect(func).to.throw(/name not set or not a String/);
    });

    it('should throw error, if lib is no string', function () {
      function func() {
        createDouble({});
      };
      expect(func).to.throw(/name not set or not a String/);
    });

    it('should return object, which can be used as testDouble, when called', function () {
      expect(createDouble('anyLib')).to.be.an.object();
    });

    it('can pass real object as second parameter, which will then be used as testDouble', function () {
      var realObject = {foo: 'bar'};
      expect(createDouble('realObject', realObject)).to.equal(realObject);
    });
  });

  describe('Given: function getLibFor And: testDouble', function () {
    before(function () {
      this.nameFor = testDoubleLib.nameFor;
      this.testDouble = testDoubleLib.createDouble('anyLib');
      testDoubleLib.createDouble('anotherLib');
    });

    it('should throw error, if called with no testDouble', function () {
      var getLibNameFor = this.nameFor;
      var func = function () {
        getLibNameFor();
      };
      expect(func).to.throw();
    });

    it('should return library name, when called with testDouble', function () {
      expect(this.nameFor(this.testDouble)).to.be('anyLib');
    });

    it('should throw error, if test double is not stored', function () {
      var getLibNameFor = this.nameFor;
      var func = function () {
        getLibNameFor({});
      };
      expect(func).to.throw();
    });
  });
});
