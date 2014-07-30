/*
 * grunt-asset-cachekiller
 * https://github.com/rcar1115/grunt-asset-cachekiller
 *
 * Copyright (c) 2014 Raul Felix Carrizo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    asset_cachekiller: {
      options: {
        file: 'test/fixtures/assets.html',
        length: 12
      },
      bust: {
        files: {
          'tmp/js': ['test/files/*.js'],
          'tmp/css': ['test/files/style.css']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'asset_cachekiller', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
