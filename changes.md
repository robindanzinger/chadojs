Version 0.3.1 / ?? ??? ????
--------------


Version 0.3.0 / 02 Dec 2016
--------------
* some small refactoring of lib/assume, lib/save
* refactoring: separated stub logic in stub.js and fluent api in assume.js
* changed eslint settings: no-use-before-define excluded for functions
* ensure compare.js only uses public lodash API
* add stubbing support, i.e. classic stubs
* add simple matcher, for example anyValue -> assume(col).canHandle('func').withArgs(types.anyValue).andReturn(true);
 -> then function will return true for any given argument
* no argument will not be handled as undefined but as empty array []
* add node 6 for travis

Version 0.2.5 / 12 May 2016
-------------
* requires lodash 4, so maybe breaking your dependency chain
* small refactoring of lib/verify
* dependencies bump
* using much stricter eslint settings

Version 0.2.4 / 24 Nov 2015
-------------
* small rework of example
* removed unused line in find_in_track
* improved verification error message. NaN will now be logged as NaN
* list unused assumptions in the console reporter

Version 0.2.3 / 15 Nov 2015
-------------
* Adding test for fail safe tracking
* ignore appending undefined arguments in assumption and verification

Version 0.2.2 / 08 Nov 2015
-------------
* Adding fail safe tracking if there is no relevant context in the stack trace

Version 0.2.1 / 31 Oct 2015
-------------
* Moving the use of existing objects to 'testDouble'

Version 0.2.0 / 25 Oct 2015
-------------
* Can now use existing objects in assumes

