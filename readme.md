# chadojs
chadojs is a mocking library for nodejs which reduces the need for integration tests. Instead of integration tests it supports writing verification tests.

# why a new mocking library
The problem with mocks is, that the tests still pass, although the real objects might not work together any more.

When I first started to learn tdd in javascript, I used mocks extensively. Whenever I renamed a unit or function, the unit tests didn't break (because they were unit-tests :-) ). But when I ran the application it crashed because the units didn't work together anymore. 

When you mock collaborating objects, you can't be sure, that the real object behaves like you expected.

There are two ways how you can deal with that. 
* Avoid mocks and use the real object instead
* Assure that mocks are in sync with the real object

### avoiding mocks
Avoiding mocks is not always possible or desired:
E.g. the real object is a 3rd party service, it's too slow, or might not always work (e.g. webservices, database-access). Or you want to test a specific behavior (which might depend on the time, week-day, or that a specific service is / is not available)
Or in outside-in tdd the collaborating object doesn't yet exist.

### integration tests
Integration tests are often used to check, whether the real objects work together.

But integration tests are hard to setup, might be slow and we can't test specific behavior which depends on a specific state (e.g. time, service-availability, failure,...). Integration tests might fail not only because of a bug but because of a depending resource which is not available for a moment.

### verification tests
Chadojs tries to address this problem with additional verification tests. 
With chadojs you do not need to write these types of integration tests. Instead whenever you mock a unit, you verify that the real object can behave like the mock.

# setup chadojs

## busterjs

# how does it work

## define an assumption

## define a verification

# inside-out vs outside-in tdd

Because chadojs doesn't need integration test it's perfect for outside-in tdd.

In classical (or bottom-up, inside-out) tdd you write first the units which do not depend on other units. Then you write the units, which only depends on units you already have written. So you usually do not need to use mocks.

(picture) todo

In outside-in (or top-down) tdd you write first the units next to the client or customer specification. But these units might depend on other units which do not already exist.
So you have to mock the depending units.

(picture) todo

# additional
##  influenced by
J.B.Rainsberger Integrated tests are a scame:<br>
http://blog.thecodewhisperer.com/blog/categories/integrated-tests-are-a-scam

## other outside-in mocking libraries
I don't know any other javascript mocking framework, which supports verification tests for mocks like chadojs.
However there are some mocking libraries in other languages:<br>
bogus for ruby: https://github.com/psyho/bogus <br>
midje for clojure: https://github.com/marick/Midje <br>

## faq

