var path = require('path');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  function resolvePath(project, file) {

    return path.join(path.dirname(require.resolve(project)), file);
  }

  grunt.initConfig({

    /********************************************************************************
    *                                                                               *
    *                               Defining Task Steps                             *
    *                                                                               *
    *********************************************************************************/
    browserify: {
      
      options: {
          browserifyOptions: { debug: true },
          transform: [
                        [ 'stringify', { extensions: [ '.bpmn' ] } ],
                        [ 'babelify', { global: true } ]
                     ]
      },
      
      watch: {
          options: { watch: true },
          files: { '.dist/index.js': [ 'app/**/*.js' ] }
      },
      
      app: {
        files: { '.dist/index.js': [ 'app/**/*.js' ] }
      }  
    }, // end-of-browserify

    copy: {
      
      diagram_js: {
        files: [
                  {
                    src: resolvePath('diagram-js', 'assets/diagram-js.css'),
                    dest: '.dist/css/vendor/diagram-js/diagram-js.css'
                  }
                ]
      },

      bpmn_js: {
        files: [
                  {
                    expand: true,
                    cwd: resolvePath('bpmn-js', 'dist/assets'),
                    src: ['**/*.*', '!**/*.js'],
                    dest: '.dist/css/vendor/bpmn-js'
                  }
               ]
      },

      jquery_ui: {
        files: [
                  {
                    src: './node_modules/jquery-ui-dist/jquery-ui.min.css',
                    dest: '.dist/css/vendor/jquery-ui/jquery-ui.min.css'
                  },
                  {
                    expand: true,
                    cwd: './node_modules/jquery-ui-dist/images', 
                    src: ['**/*.png'], 
                    dest:'.dist/css/vendor/jquery-ui/images/' 
                  }
                ]
      },

      app: {
        files: [
                  {
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.*', '!**/*.js'],
                    dest: '.dist'
                  }
                ]
      }
    }, // end-of-copy

    less: {
        options: {
                   dumpLineNumbers: 'comments',
                   paths: [ 'node_modules' ]
                 },
        styles: {
                  files: [
                    { '.dist/css/app.css': 'styles/app.less' }                  
                  ]
                }
    }, // end-of-less

    watch: {
      options: { livereload: true },

      samples: {
                  files: [ 'app/**/*.*' ],
                  tasks: [ 'copy:app', 'less' ]
               },

      less: {
              files: [
                'styles/**/*.less',
                'node_modules/bpmn-js-properties-panel/styles/**/*.less'
              ],
              tasks: ['less']
            }
    }, // end-of-watch

    connect: {
      livereload: {
                    options: 
                    {
                        port: 9013,
                        livereload: true,
                        hostname: 'localhost',
                        open: true,
                        base: ['.dist']
                    }
                  }
    } // end-of-connect
  });

    /********************************************************************************
    *                                                                               *
    *                                 Defining Tasks                                *
    *                                                                               *
    *********************************************************************************/

  grunt.registerTask('build-run', ['copy', 'less','browserify:watch', 'connect:livereload','watch' ]);

  grunt.registerTask('default', [ 'copy', 'less', 'browserify:app' ]);
};
