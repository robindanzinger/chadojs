function TestDoubleRepository () {

  var repository = [];

  function createTestDoubleFor(lib) {
    if (!lib || typeof lib !== 'string') {
      throw Error("lib not set or no String");
    }
    var testDouble = {};
    repository.push( {testDouble : testDouble, lib : lib});
    return testDouble;
  }

  function contains (testDouble) {
    return repository.some(function (testDoubleWrapper) {
      return testDoubleWrapper.testDouble === testDouble;
    });
  }

  function getLibNameFor(testDouble) { 
    return getStoredTestDouble(testDouble).lib;
  }

  function getStoredTestDouble (testDouble) {
    checkTestDouble(testDouble);

    var storedTestDouble = repository.filter(function (testDoubleWithLib) {
      return testDoubleWithLib.testDouble === testDouble;
    });
    
    if (storedTestDouble.length > 1) {
      throw Error("testDouble must be stored once");
    }

    return storedTestDouble[0];
  }

  function checkTestDouble (testDouble) {
    if (!testDouble) {
      throw Error("TestDouble required");
    }
    if (!contains(testDouble)) {
      throw Error("TestDouble not stored. TestDouble must be created in the TestDoubleRepository");
    }
  }

  return {
    createTestDoubleFor : createTestDoubleFor,
    getLibNameFor : getLibNameFor,
  }
}

function create () {
  return new TestDoubleRepository();
}

module.exports = create;

