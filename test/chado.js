'use strict';

var expect = require('must');
var chado = require('../lib/chado');

describe('Library "chado"', function () {
  it('exposes to chado.assume', function () {
    expect(chado.assume).to.exist();
  });

  it('exposes to chado.verify', function () {
    expect(chado.verify).to.exist();
  });

  it('exposes to chado.createDouble', function () {
    expect(chado.createDouble).to.exist();
  });

  it('uses same objects if required twice', function () {
    var chado2 = require('../lib/chado');
    expect(chado2).to.be(chado);
    var collab1 = chado2.createDouble('collab1');
    chado2.assume(collab1).canHandle('foo').andReturns('bar');

    expect(chado2.repo.collab1.foo).to.exist();
  });

  it('can create a new chado config', function () {
    var chado2 = chado.create();
    expect(chado2).to.not.be(chado);
    var collab2 = chado2.createDouble('collab2');
    chado2.assume(collab2).canHandle('foo').andReturns('bar');

    expect(chado.assume).to.not.be(chado2.assume);
    expect(chado.verify).to.not.be(chado2.verify);
    expect(chado.consoleReporter).to.not.be(chado2.consoleReporter);

    expect(chado2.repo.collab1).to.not.exist();
    expect(chado.repo.collab1.foo).to.exist();
  });
});

