'use strict';

var chado = require('chado');
var createDouble = chado.createDouble;
var assume = chado.assume;
var verify = chado.verify;

describe('pizza restaurant', function () {
  describe('a customer can order a pizza', function () {
    it('gets the pizza from the waiter', function customer() {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza').andReturns('pizza');
    });

    it('gets an error from the waiter when pantry is empty', function customer() {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza').andThrowsError('Empty pantry');
    });
  });

  describe('waiter', function () {
    it('passes the order to the chef', function () {
      var chef = createDouble('chef');
      var waiter = createWaiter(chef);
      assume(chef).canHandle('make').withArgs('pizza').andReturns('pizza');
      verify('waiter').canHandle('order').withArgs('pizza').andReturns('pizza')
        .on(waiter);
    });

    it('throws an error, when the chef throws the error "Empty pantry"', function () {
      var chef = createDouble('chef');
      var waiter = createWaiter(chef);
      assume(chef).canHandle('make').withArgs('pizza').andThrowsError('Empty pantry');
      verify('waiter').canHandle('order').withArgs('pizza').andThrowsError('Empty pantry')
        .on(waiter);
    });
  });

  describe('chef', function () {
    it('can make pizzas, when dough, cheese and tomato sauce are in and can be taken from the pantry', function () {
      var pantry = createDouble('pantry');
      var chef = createChef(pantry);
      assume(pantry).canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce']).andReturns(true);
      assume(pantry).canHandle('take').withArgs('dough').andReturns('dough');
      assume(pantry).canHandle('take').withArgs('cheese').andReturns('cheese');
      assume(pantry).canHandle('take').withArgs('tomato sauce').andReturns('tomato sauce');
      verify('chef').canHandle('make').withArgs('pizza').andReturns('pizza').on(chef);
    });

    it('throws an error, when pantry is empty', function () {
      var pantry = createDouble('pantry');
      var chef = createChef(pantry);
      assume(pantry).canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce']).andReturns(false);
      verify('chef').canHandle('make').withArgs('pizza').andThrowsError('Empty pantry').on(chef);
    });
  });

  describe('pantry', function () {
    it('when food is stored in the pantry, then has(food...) returns true', function () {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      pantry.add('tomato sauce');
      verify('pantry').canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce'])
        .andReturns(true)
        .on(pantry);
    });

    it('when food is stored in the pantry, then take(food) returns the food', function () {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      pantry.add('tomato sauce');
      verify('pantry').canHandle('take').withArgs('dough').andReturns('dough').on(pantry);
      verify('pantry').canHandle('take').withArgs('cheese').andReturns('cheese').on(pantry);
      verify('pantry').canHandle('take').withArgs('tomato sauce').andReturns('tomato sauce').on(pantry);
    });

    it('when food is not stored in the pantry, then has(food...) returns false', function pantry3() {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      verify('pantry').canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce'])
        .andReturns(false)
        .on(pantry);
    });
  });
});

function createWaiter(chef) {
  function order(menu) {
    return chef.make(menu);
  }

  return {
    order: order
  };
}

function createChef(pantry) {
  var recipes = {
    'pizza': ['dough', 'cheese', 'tomato sauce']
  };

  function make(menu) {
    var ingredients = recipes[menu];
    if (!pantry.has(ingredients)) {
      throw Error('Empty pantry');
    }
    ingredients.forEach(function (ingredient) {
      pantry.take(ingredient);
    }, this);

    return menu;
  }

  return {
    make: make
  };
}

function createPantry() {
  var storedFood = {};

  function add(food) {
    if (!storedFood[food]) {
      storedFood[food] = [];
    }
    storedFood[food].push(food);
  }

  function has(foods) {
    return foods.every(function (food) {
      return storedFood[food] && storedFood[food].length > 0;
    }, this);
  }

  function take(food) {
    return storedFood[food].pop();
  }

  return {
    has: has,
    add: add,
    take: take
  };
}
