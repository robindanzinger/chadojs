'use strict';
module.exports = function (grunt) {
  /*eslint camelcase: 0*/

  grunt.initConfig({
                     eslint: {
                       options: {quiet: true},
                       target: ['lib/**/*.js', 'test/*.js', 'example/*.js', 'Gruntfile.js']
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
                     }
                   });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('tests', ['eslint', 'mocha_istanbul']);

  // Default task.
  grunt.registerTask('default', ['tests']);
};

