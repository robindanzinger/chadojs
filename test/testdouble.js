'use strict';

var expect = require('must');
var testDoubleLib = require('../lib/testdouble');

describe('Library "testdouble"', function () {

  var createDouble = testDoubleLib.createDouble;

  describe('Function "createDouble"', function () {
    it('returns a new object to be used as testDouble', function () {
      expect(createDouble('anyLib')).to.be.an.object();
    });

    it('returns a new object initialized with some variables', function () {
      expect(createDouble('anyLib')).to.eql({chadojsNamespace: 'anyLib', chadojsBackup: {}});
    });

    it('can pass real object as second parameter, which will then be used as testDouble', function () {
      var realObject = {foo: 'bar'};
      expect(createDouble('realObject', realObject)).to.be(realObject);
      expect(realObject.chadojsNamespace).to.be('realObject');
      expect(realObject.chadojsBackup).to.exist();
    });

    it('has a mandatory "name" attribute', function () {
      function func() { createDouble(); }

      expect(func).to.throw(/name not set or not a String/);
    });

    it('has a mandatory "name" attribute of type String', function () {
      function func() { createDouble({}); }

      expect(func).to.throw(/name not set or not a String/);
    });
  });

  describe('getting the name for a testDouble', function () {
    var nameFor = testDoubleLib.nameFor;

    it('returns the registered name of the double', function () {
      testDoubleLib.createDouble('someLib');
      var testDouble = testDoubleLib.createDouble('anyLib');

      expect(nameFor(testDouble)).to.be('anyLib');
    });

    it('throws an error, if called without argument', function () {
      function func() {
        nameFor();
      }

      expect(func).to.throw();
    });

    it('throws an error, if called with an invalid argument (not registered as test double)', function () {
      function func() {
        nameFor({});
      }

      expect(func).to.throw();
    });
  });
});
