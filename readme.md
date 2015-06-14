experimental stuff
under development

[![Build Status(https://api.travis-ci.org/robindanzinger/chadojs.png)](https://travis-ci.org/robindanzinger/chadojs)

# chadojs
chadojs is a mocking library for nodejs which reduces the need for integration tests. Instead of integration tests it supports writing verification tests.

## why a new mocking library
The problem with mocks is, that the tests still pass, although the real objects might not work together any more.

When I first started to learn tdd in javascript, I used mocks extensively. Whenever I renamed a unit or function, the unit tests didn't break (because they were unit-tests :-) ). But when I ran the application it crashed because the units didn't work together anymore. 

When you mock collaborating objects, you can't be sure, that the real object behaves like you expected.

There are two ways how you can deal with that. 
* Avoid mocks and use the real object instead
* Assure that mocks are in sync with the real object

### avoiding mocks
Avoiding mocks is not always possible or desired:
E.g. the real object is a 3rd party service, it's too slow, or might not always work (e.g. webservices, database-access). Or you want to test a specific behavior (which might depend on the time, week-day, or that a specific service is / is not available). Or in outside-in tdd the collaborating object doesn't yet exist.

### integration tests
Integration tests are often used to check, whether the real objects work together.

But integration tests are hard to setup, might be slow and we can't test specific behavior which depends on a specific state (e.g. time, service-availability, failure,...). Integration tests might fail not only because of a bug but because of a depending resource which is not available for a moment.

### verification tests
chadojs tries to address this problem with additional verification tests. With chadojs you do not need to write these types of integration tests. Instead whenever you mock a unit, you verify that the real object can behave like the mock.

## install chadojs
npm install chado

## setup chadojs

### busterjs
create a new file (e.g.: buster-chado.js) in your test directory and add the following lines. 
```js
var chado = require('chado');
var fs = require('fs');
var testRunner = require('buster').testRunner;
testRunner.on('suite:end', function () {
  chado.consoleReporter.logReport();
  fs.writeFile(
    "chado-result.json", 
    JSON.stringify(chado.repo, null, 2)
  );
});
```

### mocha
create a new file (e.g.: mocha-chado.js) in your test directory and add the following lines. 
```js
var chado = require('chado');
var fs = require('fs');
after( function () {
  chado.consoleReporter.logReport();
  fs.writeFileSync(
    "chado-result.json", 
    JSON.stringify(chado.repo, null, 2)
  );
});
```

### other testrunners
ensure that after the test suite ran chado.consoleReporter.logReport() is called and if you want to use the html-reporter that the chado.repo is written to a file.

## how does it work

chadojs uses an assume-verify-approach<br>
When you mock a function in chadojs you make an assumption about how the real object behaves.
On the other hand you have to verify that the real object can behave like you assumed.

If you forget to verify an assumption, chadojs reminds you, that there might be a problem.<br>
If you verify an assumption, but you forgot to make the assumption, chadojs reminds you, that you might not have tested all necessary use cases.

### create a mock

```js
var createDouble = require('chado').createDouble;
var myTestdouble = createDouble('libname');
```
Note: every mock (or testdouble) is a new empty object. It neither creates a partial mock nor supports to call the real implementation. See in FAQ and simple design philosophy why.

### define an assumption

```js
var chado = require('chado');
var lib = chado.createDouble('myLib');
var assume = chado.assume;
```

assume function returns a value
```js
assume(lib).canHandle('foo').andReturns('bar');
// lib.foo() === 'bar'
assume(lib).canHandle('foo').withArgs('argument').andReturns('bar');
// lib.foo('argument') === 'bar'
assume(lib).canHandle('foo').withArgs('first', 2, 'third').andReturns('bar');
// lib.foo('first', 2, 'third) === 'bar'
```

assume function throws an error
```js
assume(lib).canHandle('foo').andThrowsError('error message');
// lib.foo() -> Error: error message
assume(lib).canHandle('foo').withArgs('argument').andThrowsError('error message');
// lib.foo('argument') -> Error: error message
```

assume function calls a given callback
```js
var callback = chado.callback
// var realCallback = function (result) {console.log(result);};

assume(lib).canHandle('foo').withArgs(callback).andCallsCallbackWith();
// lib.foo(realCallback) -> console: undefined
assume(lib).canHandle('foo').withArgs(callback).andCallsCallbackWith('bar');
// lib.foo(realCallback) -> console: 'bar'
assume(lib).canHandle('foo').withArgs(callback, 'argument').andCallsCallbackWith('bar');
// lib.foo('argument', realCallback) -> Error
// lib.foo(realCallback, 'argument') -> console: 'bar'
assume(lib).canHandle('foo').withArgs('argument', callback).andCallsCallbackWith('bar');
// lib.foo('argument', realCallback) -> console: 'bar'
// lib.foo(realCallback, 'argument') -> Error
```

### define a verification

```js
var chado = require('chado');
var testdouble = chado.createDouble('myLib');
var verify = chado.verify;
```

verify function returns a value
```js
var lib = {foo:function () { return 'bar';}};
// ok
verify('myLib').canHandle('foo').andReturns('bar').on(lib);
verify('myLib').canHandle('foo').withArgs('argument').andReturns('bar').on(lib);
verify('myLib').canHandle('foo').withArgs('first', 2, 'third').andReturns('bar').on(lib);
// error
verify('myLib').canHandle('foo').andReturns('foo').on(lib); // because bar != foo
verify('myLib').canHandle('foo').withArgs('arg').andReturns('bar').on(lib); // because argument != arg
verify('myLib').canHandle('foo').withArgs(1, 2, 'third').andReturns('bar').on(lib); // because 1 != first
```

verify function throws an error
```js
var lib = {foo: function () { throw Error('error message');}};
// ok: 
verify('myLib').canHandle('foo').andThrowsError('error message').on(lib);
// error:
verify('myLib').canHandle('bang').andThrowsError('error message').on(lib);
// ok
verify('myLib').canHandle('foo').withArgs('argument').andThrowsError('error message').on(lib);
```

verify function calls a given callback
```js
var callback = chado.callback; // this function is never called in verify!
var lib = {foo: function (callback) {callback();};

// ok
verify('myLib').canHandle('foo').withArgs(callback).andCallsCallbackWith().
  on(lib, function () {});    

// throws error, because lib.foo doesn't call callback with argument 'bar'
verify('myLib').canHandle('foo').withArgs(callback).andCallsCallbackWith('bar').
  on(lib, function () {});    

// ok
lib = {foo: function (callback) {callback('bar');};
verify('myLib').canHandle('foo').withArgs(callback).andCallsCallbackWith('bar').
  on(lib, function () {});    

// throws error, because lib.foo uses first argument as callback
verify('myLib').canHandle('foo').withArgs(callback, 'argument').andCallsCallbackWith('bar').
  on(lib, function () {});    
  
// ok
lib = {foo: function (argument, callback) {callback('bar');};
verify('myLib').canHandle('foo').withArgs(callback, 'argument').andCallsCallbackWith('bar').
  on(lib, function () {});    
```

### evaluate assumptions and verifications
##### manual evaluation with chado.analyzer
```js
var chado = require('chado');
// chado.repo is the repository and contains all assumptions and verifications
var repo = chado.repo;
// chado.analyzer contains functions for analyzing the assumptions and verifications
var analyzer = chado.analyzer;
// first we have to convert the repository to an array
var reportArray = analyzer.read(chado.repo);

// now we can call some functions on that array
// get all assumptions which aren't verified
var notVerifiedAssumptions = analyzer.getNotVerifiedAssumptions(reportArray);
// get all verifications which weren't assumed
var notAssumedVerifications = analyzer.getNotAssumedVerifications(reportArray);

```
##### simple console reporter
add chado.consoleReporter.logReport() after test-suite is run. Then a report is logged to the console which lists all not verified assumptions and all not assumed verifications. 
```
======================
CHADO CONSOLE REPORTER
======================

WARNING: some assumptions aren't verified
-----------------------------------------------
  lib.foo("any argument") => returns "bar"

-----------------------------------------------
WARNING: some verifications aren't assumed
--------------------------------------------------------------
  lib.foo("any argument") => returns "foobar"

--------------------------------------------------------------
```
##### html reporter
Save the assumptions repository to a file. Then you can use the chado html reporter for a more detailed report and analyze your assumptions.
```js
var fs = require('fs'); // or any other file writer library
var json = JSON.stringify(chado.repo, null, 2)
fs.writeFile("chado-result.json", json);
```

## addition

### inside-out vs outside-in tdd

Because chadojs doesn't need integration test it's perfect for outside-in tdd.

In classical (or bottom-up, inside-out) tdd you write first the units which do not depend on other units. Then you write the units, which only depends on units you already have written. So you usually do not need to use mocks.

(picture) todo

In outside-in (or top-down) tdd you write first the units next to the client or customer specification. But these units might depend on other units which do not already exist.
So you have to mock the depending units.

(picture) todo

### pizza restaurant - an example
[pizza restaurant - an example](https://github.com/robindanzinger/chadojs/blob/master/example/example.md)

### simple design philosophy
If it gets too complicated, maybe you should rethink about your design.

It's one of the hardest part of programming (or anything else in the world?) to make things as simple as possible. In most cases we tend to make things complicated (at least I do). And then we extend or adapt our frameworks and libraries, which makes them complicated, too. To keep chadojs simple, it is made only for one purpose: check if two units can work together. For other purposes maybe it's not the right tool.

chadojs assumes that you either want to mock an object away or not. If you want to mock only a part of an object, maybe the object doesn't fulfill the single responsibility principle. Maybe you could split up your object in two. One object which you don't mock, another which you mock entirely. 

chadojs doesn't support (yet?) to call the real implementation inside a mock. It doesn't support clever mocks like counting the number of calls or change the behaviour depending on if it's the first or second call. It doesn't check the behaviour of a unit. If you want to test or change the behaviour you can use another mocking framework. 

However, in chadojs you should only describe how a unit uses another unit and verify whether the other unit actually works as expected.

###  references
J.B.Rainsberger: Integrated tests are a scam:<br>
http://blog.thecodewhisperer.com/blog/categories/integrated-tests-are-a-scam

I don't know any other javascript mocking framework, which supports verification tests for mocks like chadojs.
However there are some similar mocking libraries in other languages:
 * bogus for ruby: https://github.com/psyho/bogus 
 * midje for clojure: https://github.com/marick/Midje

### licence
The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

http://opensource.org/licenses/MIT

## faq
