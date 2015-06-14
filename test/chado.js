var expect = require('must');
var chado = require('../lib/chado');
describe('library chado', function () {
  it('has access to chado.assume', function () {
    expect(chado.assume).exist();
  }),
  it('has access to chado.verify', function () {
    expect(chado.verify).exist();
  }),
  it('has access to chado.createDouble', function () {
    expect(chado.createDouble).exist();
  }),
  it('if chado is loaded twice, same objects are used', function () {
    var chado2 = require('../lib/chado');
    var assume = chado.assume;
    var createDouble = chado.createDouble;
    var lib = createDouble('myLib');
    assume(lib).canHandle('foo').andReturns('bar');

    expect(chado2.repo.myLib.foo).exist();
  }),
  it('can create a new chado config', function () {
    var chado2 = chado.create();
    var assume = chado.assume;
    var createDouble = chado.createDouble;
    var lib = createDouble('myLib');
    assume(lib).canHandle('foo').andReturns('bar');

    expect(chado2.repo.myLib).not.exist();
    expect(chado.repo.myLib.foo).exist();
  })
});

