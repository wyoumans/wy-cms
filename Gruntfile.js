'use strict';

/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`,
 * the following files will be automatically injected( in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function(grunt) {

  /**
   * CSS files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails also supports LESS in development and production.
   * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task
   * below for more options.  For this to work, you may need to install new
   * dependencies, e.g. `npm install grunt-contrib-sass`
   */

  var cssFilesToInject = [
    'linker/styles/style.css'
  ];

  /**
   * Javascript files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * To use client-side CoffeeScript, TypeScript, etc., edit the
   * `sails-linker:devJs` task below for more options.
   */

  var jsFilesToInject = [
    'linker/js/index-compiled.js',
  ];

  /**
   * The asset version number used to bust caches on production
   * when something has changed.
   */

  var assetVersion = '20140418';

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  //
  // DANGER:
  //
  // With great power comes great responsibility.
  //
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // Modify css file injection paths to use
  cssFilesToInject = cssFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use
  jsFilesToInject = jsFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
  });

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-templatizer');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: './assets',
          src: ['**/*.!(jade|less|coffee)'],
          dest: '.tmp/public'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }]
      }
    },

    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    less: {
      dev: {
        files: [{
          expand: true,
          cwd: 'assets/styles/',
          src: ['*.less'],
          dest: '.tmp/public/styles/',
          ext: '.css'
        }, {
          expand: true,
          cwd: 'assets/linker/styles/',
          src: ['*.less'],
          dest: '.tmp/public/linker/styles/',
          ext: '.css'
        }]
      }
    },

    concat: {
      js: {
        src: jsFilesToInject,
        dest: '.tmp/public/min/production-' + assetVersion + '.js'
      }
    },

    uglify: {
      dist: {
        src: jsFilesToInject,
        dest: '.tmp/public/min/production-' + assetVersion + '.js'
      }
    },

    cssmin: {
      dist: {
        src: cssFilesToInject,
        dest: '.tmp/public/min/production-' + assetVersion + '.css'
      }
    },

    templatizer: {
      dev: {
        options: {},
        files: {
          './assets/linker/js/lib/templates.js': ['assets/linker/**/*.jade']
        }
      }
    },

    browserify: {
      dev: {
        files: {
          './assets/linker/js/index-compiled.js': ['./assets/linker/js/index.js']
        }
      }
    },

    'sails-linker': {
      devJs: {
        options: {
          startTag: '//- SCRIPTS',
          endTag: '//- SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="/%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': jsFilesToInject
        }
      },

      prodJs: {
        options: {
          startTag: '//- SCRIPTS',
          endTag: '//- SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="/%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production-' + assetVersion + '.js']
        }
      },

      devStyles: {
        options: {
          startTag: '//- STYLES',
          endTag: '//- STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="/%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': cssFilesToInject
        }
      },

      prodStyles: {
        options: {
          startTag: '//- STYLES',
          endTag: '//- STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="/%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production-' + assetVersion + '.css']
        }
      }
    },

    watch: {
      api: {
        // API files to watch:
        files: ['api/**/*']
      },
      assets: {
        // Assets to watch:
        files: ['assets/**/*', '!assets/linker/js/index-compiled.js'],
        // When assets are changed:
        tasks: ['compileAssets', 'linkAssets']
      }
    }
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'templatizer:dev',
    'browserify:dev',
    'less:dev',
    'copy:dev'
  ]);

  grunt.registerTask('linkAssets', [
    'sails-linker:devJs',
    'sails-linker:devStyles'
  ]);

  // Build the assets into a web accessible folder.
  // (handy for phone gap apps, chrome extensions, etc.)
  grunt.registerTask('build', [
    'compileAssets',
    'linkAssets',
    'clean:build',
    'copy:build'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    'templatizer:dev',
    'browserify:dev',
    'less:dev',
    'copy:dev',
    'concat',
    // 'uglify',
    'cssmin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles'
  ]);

  // When API files are changed:
  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln(filepath + ' has ' + action);

    // Send a request to a development-only endpoint on the server
    // which will reuptake the file that was changed.
    var baseurl = grunt.option('baseurl'),
      gruntSignalRoute = grunt.option('signalpath'),
      url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

    require('http').get(url).on('error', function(e) {
      console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
    });
  });
};
