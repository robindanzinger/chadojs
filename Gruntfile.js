module.exports = function (grunt) {
  /*eslint camelcase: 0*/
  'use strict';

  // set up common objects for jslint
  var jsLintStandardOptions = {edition: 'latest', errorsOnly: true, failOnError: true};

  var defaultDirectives = function () {
    return {indent: 2, node: true, nomen: true, todo: true, unparam: true, vars: true};
  };
  var jsLintLibDirectives = defaultDirectives();
  var jsLintTestDirectives = defaultDirectives();
  jsLintTestDirectives.ass = true;
  jsLintTestDirectives.predef = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

  grunt.initConfig({
    eslint: {
      options: {quiet: true},
      target: ['lib/*.js']
    },
    jslint: {
      lib: {
        src: [
          'lib/*.js'
        ],
        directives: jsLintLibDirectives,
        options: jsLintStandardOptions
      },
      tests: {
        src: [
          'test/*.js'
        ],
        directives: jsLintTestDirectives,
        options: jsLintStandardOptions
      }
    },
    mocha_istanbul: {
       test: {
        src: 'test',
        options: {
          coverageFolder: 'coverage',
          timeout: 6000,
          slow: 100,
          mask: '**/*.js',
          root: './lib',
          reporter: 'dot',
          check: {
            lines: 90,
            statements: 90
          }
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*',
          check: {
            lines: 90,
            statements: 90
          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('tests', ['eslint', 'mocha_istanbul', 'istanbul_check_coverage:default']);

  // Default task.
  grunt.registerTask('default', ['tests']);
};

