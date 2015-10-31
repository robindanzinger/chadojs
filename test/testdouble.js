'use strict';

var expect = require('must');
describe('Library testdouble', function () {
  var testDoubleLib;

  before(function () {
    testDoubleLib = require('../lib/testdouble');
  });

  describe('Given: function createTestDoubleFor', function () {
    before(function () {
      this.createTestDoubleFor = testDoubleLib.createTestDoubleFor;
    });

    it('should throw error, if called without lib name', function () {
      var createTestDoubleFor = testDoubleLib.createTestDoubleFor;
      var func = function () {
        createTestDoubleFor();
      };
      expect(func).to.throw();
    });

    it('should throw error, if lib is no string', function () {
      var createTestDoubleFor = testDoubleLib.createTestDoubleFor;
      var func = function () {
        createTestDoubleFor({});
      };
      expect(func).to.throw();
    });

    it('should return object, which can be used as testDouble, when called', function () {
      expect(this.createTestDoubleFor('anyLib')).to.be.an.object();
    });

    it('can pass real object as second parameter, which will then be used as testDouble', function () {
      var realObject = {foo: 'bar'};
      expect(this.createTestDoubleFor('realObject', realObject)).to.equal(realObject);
    });
  });

  describe('Given: function getLibFor And: testDouble', function () {
    before(function () {
      this.getLibNameFor = testDoubleLib.getLibNameFor;
      this.testDouble = testDoubleLib.createTestDoubleFor('anyLib');
      testDoubleLib.createTestDoubleFor('anotherLib');
    });

    it('should throw error, if called with no testDouble', function () {
      var getLibNameFor = this.getLibNameFor;
      var func = function () {
        getLibNameFor();
      };
      expect(func).to.throw();
    });

    it('should return library name, when called with testDouble', function () {
      expect(this.getLibNameFor(this.testDouble)).to.be('anyLib');
    });

    it('should throw error, if test double is not stored', function () {
      var getLibNameFor = this.getLibNameFor;
      var func = function () {
        getLibNameFor({});
      };
      expect(func).to.throw();
    });
  });
});
