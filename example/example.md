# chado example

## outside-in tdd without integration tests

chadojs supports you in outside-in tdd. 
In outside-in tdd you write your units and tests starting from the units next to the client. These outer units might depend on other units - the inner units. 
Whenever a unit (the outer unit) depends on another unit (the inner unit) you have to mock that inner unit due to it doesn't yet exist. When you mock you make an assumption about the real unit, i.e. how you think it should behave.

When you write the inner units, you have to verify your assumptions made on the mock.
You can do this with an integration test. But instead of integration tests chado uses verification tests, which are similar to unit tests. 
With chado you can guarantee without integration tests, that the outer unit does not only work with the testdouble but also with the real (inner) unit.

## pizza restaurant - an example

In our example a customer should be able to order a pizza from a waiter. The waiter then asks the chef to make the pizza. The chef gets the ingredients from the pantry and makes the pizza.

![alt tag](https://github.com/robindanzinger/chadojs/blob/master/example/overview.jpg)

The customer is the client of our program. Waiter, Chef and Pantry shall be our units, i.e. they should work and be tested independently. We start writing code from outside-in. Our first unit will be the Waiter, then the Chef and finally the Pantry.

### 0. using chado in your test files
```js
var chado = require('chado');
var createDouble = chado.createDouble;
var assume = chado.assume; // with assume you describe your assumption
var verify = chado.verify; // with verify you can check your assumptions against a real object
```
 
### 1. specification

a customer can order a pizza from the waiter
```js
describe('pizza restaurant', function(){
  describe('a customer can order a pizza', function() {
    it('gets the pizza from the waiter', function customer () {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza').andReturns('pizza');
    })
  })
})
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some assumptions aren't verified
-----------------------------------------
  waiter.order("pizza") => returns "pizza"

-----------------------------------------
```


### 2. verify the assumption for the waiter

We need to verify, that the waiter returns a pizza. 
But he doesn't make the pizza. He has to pass the order to the chef. 
```js
  describe('waiter', function(){
    it('passes the order to the chef', function waiter () {
      var chef = createDouble('chef');
      var waiter = createWaiter(chef);
      assume(chef).canHandle('make').withArgs('pizza').andReturns('pizza');
      verify('waiter').canHandle('order').withArgs('pizza').andReturns('pizza')
        .on(waiter);
    })
  })
```

waiter
```js
function createWaiter(chef) {
  function order(menu) {
    return chef.make(menu);
  } 
  return {
    order:order
  }
}
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some assumptions aren't verified
-----------------------------------------
  chef.make("pizza") => returns "pizza"

-----------------------------------------
```

### 3. verify the assumption for the chef

To implement the chef we need another unit - the pantry.  It contains food and the ingredients for the pizza can be taken from it.

```js
  describe('chef', function () {
    it('can make pizzas, when dough, cheese and tomato sauce are in and can be taken from the pantry', function chef () {
      var pantry = createDouble('pantry');
      var chef = createChef(pantry);
      assume(pantry).canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce']).andReturns(true);
      assume(pantry).canHandle('take').withArgs('dough').andReturns('dough');
      assume(pantry).canHandle('take').withArgs('cheese').andReturns('cheese');
      assume(pantry).canHandle('take').withArgs('tomato sauce').andReturns('tomato sauce');
      verify('chef').canHandle('make').withArgs('pizza').andReturns('pizza').on(chef);
    })
  })
```

chef
```js
function createChef(pantry) {
  var recipes = {
    'pizza' : ['dough', 'cheese', 'tomato sauce']
  }
  function make(menu) {
    var ingredients = recipes[menu];
    if (pantry.has(ingredients)) {
     ingredients.forEach(function (ingredient) {
       pantry.take(ingredient); 
     }, this);
    }

    return menu;
  }
  return {
    make:make
  }
}

```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some assumptions aren't verified
-----------------------------------------
  pantry.has(["dough","cheese","tomato sauce"]) => returns true
  pantry.take("cheese") => returns "cheese"
  pantry.take("dough") => returns "dough"
  pantry.take("tomato sauce") => returns "tomato sauce"

-----------------------------------------
```

### 4. verify the assumptions for the pantry

```js
  describe('pantry', function () {
    it('when food is stored in the pantry, then has(food...) returns true', function pantry1 () {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      pantry.add('tomato sauce');
      verify('pantry').canHandle('has').withArgs(['dough','cheese','tomato sauce'])
        .andReturns(true)
        .on(pantry);
    }),
    it('when food is stored in the pantry, then take(food) returns the food', function pantry3 () {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      pantry.add('tomato sauce');
      verify('pantry').canHandle('take').withArgs('dough').andReturns('dough').on(pantry);    
      verify('pantry').canHandle('take').withArgs('cheese').andReturns('cheese').on(pantry);    
      verify('pantry').canHandle('take').withArgs('tomato sauce').andReturns('tomato sauce').on(pantry);    
    })
```

pantry
```js
function createPantry() {
  var storedFood = {} 
  function add(food) {
    if (!storedFood[food]) {
      storedFood[food] = [];
    }
    storedFood[food].push(food);
  }

  function has(foods) {
    return foods.every(function(food) {
      return storedFood[food] && storedFood[food].length > 0;
    }, this);
  }

  function take(food) {
    return storedFood[food].pop();
  }

  return {
    has : has,
    add : add,
    take : take
  }
}
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


```

### 5. verify that the pantry can also return false

Everything is ok now. The customer can order a pizza, when the waiter passes the order to the chef. The chef can make a pizza, when he can take the ingredients from the pantry. 
But what happens when the pantry doesn't contain the needed ingredients? 

We might not have thought about this, when we wrote the test for the waiter. But now we implement the pantry and notice that we should test that scenario, too.
Let's write a verification test, that the pantry can not only return true but also false for the same arguments.
```js
  describe('pantry', function () {
    ...
    it('when food is not stored in the pantry, then has(food...) returns false', function pantry3 () {
      var pantry = createPantry();
      pantry.add('dough');
      pantry.add('cheese');
      verify('pantry').canHandle('has').withArgs(['dough','cheese','tomato sauce'])
        .andReturns(false)
        .on(pantry); 
    })
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some verifications aren't assumed
------------------------------------------
  pantry.has(["dough","cheese","tomato sauce"]) => returns false

------------------------------------------
```
All assumption are verified, but not all verifications are assumed. Maybe we have a bug! So let's test if the chef can handle the return value 'false' from pantry.has(food...)

### 6. assume your verification pantry returns false

When the pantry returns false, then the chef throws an error. 
```js
  describe('chef', function () {
    ...
    it('throws error, when pantry is empty', function chef2 () {
      var pantry = createDouble('pantry');
      var chef = createChef(pantry);
      assume(pantry).canHandle('has').withArgs(['dough', 'cheese', 'tomato sauce']).andReturns(false);
      verify('chef').canHandle('make').withArgs('pizza').andThrowsError('Empty pantry').on(chef);
    })
```

chef
```js
function createChef(pantry) {
  var recipes = {
    'pizza' : ['dough', 'cheese', 'tomato sauce']
  }
  function make(menu) {
    var ingredients = recipes[menu];
    if (!pantry.has(ingredients)) {
      throw new Error('Empty pantry');
    }
    ingredients.forEach(function (ingredient) {
      pantry.take(ingredient); 
    }, this);

    return menu;
  }
  return {
    make:make
  }
}
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some verifications aren't assumed
------------------------------------------
  chef.make("pizza") => throws Error: Empty pantry

------------------------------------------
```

Ok, our chef can handle the response false and throws an error. But our waiter cannot yet handle an error.

### 7. assume the verification chef throws an error

When the chef throws an error, the waiter should throw that error, too. 
```js
  describe('waiter', function () {
    ...
    it('throws an error, when the chef throws the error "Empty pantry"', function waiter2() {
      var chef = createDouble('chef');
      var waiter = createWaiter(chef);
      assume(chef).canHandle('make').withArgs('pizza').andThrowsError('Empty pantry');
      verify('waiter').canHandle('order').withArgs('pizza').andThrowsError('Empty pantry')
        .on(waiter);
    })
```

console output
```
======================
CHADO CONSOLE REPORTER
======================


WARNING: some verifications aren't assumed
------------------------------------------
  waiter.order("pizza") => throws Error: Empty pantry

------------------------------------------
```

### 8. Add the new scenario to the specification

```js
  describe('a customer can order a pizza', function() {
    it('gets the pizza from the waiter', function customer () {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza').andReturns('pizza');
    })
    it('gets an error from the waiter when pantry is empty', function customer () {
      var waiter = createDouble('waiter');
      assume(waiter).canHandle('order').withArgs('pizza').andThrowsError('Empty pantry');
    })
  })
```

console output
```
======================
CHADO CONSOLE REPORTER
======================
```

### 9. What next?
Now our pizza restaurant is fully tested. The waiter can talk to the chef. And the chef works with the pantry. Even error handling is implemented although we didn't think of it when we made the specification.
What next? Another specification? How does the pantry get filled? Or are there any other issues, which we discovered when we wrote the program? Go on with your imagination and what you think we still miss.

### references
[example code](https://github.com/robindanzinger/chadojs/blob/master/example/example.js)

