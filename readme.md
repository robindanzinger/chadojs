# chadojs
chadojs is a mocking library for nodejs which reduces the need for integration tests. Instead of integration tests it supports writing verification tests.

# why a new mocking library
When I first started to learn tdd in javascript, I used mocks extensively. But whenever I renamed a unit or function, the unit tests still worked. But when I ran the application it crashed because the units didn't work together anymore. 
What happened:

One of the drawbacks of unit tests is that when you mock collaborating objects, you can't be sure, if the real object behaves like you expected.
There are two ways how to deal with that. 
In classical (or bottom-up, inside-out) tdd you write first the units which do not depend on other units.

(picture)

Then you write the units, which only depends on units you already have written.
So you usually do not need to write mocks. 

Although you will still need sometimes mocks when the real object might be too slow, or might not always work (e.g. webservices, database-access). Or you want to test a specific behavior (which might depend on the time, week-day, or that a specific service is not available)

In outside-in (or top-down) tdd you write first the units next to the client or customer specification. But these units might depend on other units which do not already exist.
So you have to mock the depending units.

(picture)

But what happens, when the behavior or signature of the depending unit changes. 
When we have mocked them, the tests still pass, although the real objects might not work together any more.

To assure, that the real objects work together, we can write some integration tests.
But integration tests are hard to setup, might be slow and we can't test specific behavior which depends on a specific state (time, service-availability). Integration tests might fail not only because of a bug but because of a depending resource which is not available for a moment).

With chadojs you do not need to write these types of integration tests. Instead whenever you mock a unit, you have to verify that the real object behaves like the mock.
chadojs supports you in writing these verification tests.

# setup chadojs

## busterjs

# how does it work

## define an assumption

## define a verification


#  influenced by
J.B.Rainsberger Integrated tests are a scame:<br>
http://blog.thecodewhisperer.com/blog/categories/integrated-tests-are-a-scam

# other outside-in mocking libraries
I don't know any other javascript mocking framework, which supports verification tests for mocks like chadojs.
However there are some mocking libraries in other languages:<br>
bogus for ruby: https://github.com/psyho/bogus <br>
midje for clojure: https://github.com/marick/Midje <br>

# faq

