'use strict';

var expect = require('must');
var findInStack = require('../lib/find_in_stack');

var standardStack = [
  'Error',
  '    at track (/JavascriptDev/chadojs/lib/track.js:6:28)',
  '    at assume (/JavascriptDev/chadojs/lib/assume.js:13:31)',
  '    at Context.<anonymous> (/JavascriptDev/chadojs/test/assume.js:19:7)'
];
var noContextStack = [
  'Error',
  '    at track (/JavascriptDev/chadojs/lib/track.js:6:28)',
  '    at assume (/JavascriptDev/chadojs/lib/assume.js:13:31)',
  '    at /JavascriptDev/chadojs/test/assume.js:19:7'
];

describe('find_in_stack', function () {
  it('detects and separates information when stack trace has a context (in line 3)', function () {
    expect(findInStack(standardStack)).to.eql(['at Context.<anonymous> (/JavascriptDev/chadojs/test/assume.js:19:7)', 'Context.<anonymous>', '/JavascriptDev/chadojs/test/assume.js', '19', '7']);
  });

  it('detects and separates information when stack trace does not have a context (in line 3)', function () {
    expect(findInStack(noContextStack)).to.eql(['at /JavascriptDev/chadojs/test/assume.js:19:7', '', '/JavascriptDev/chadojs/test/assume.js', '19', '7']);
  });
});
