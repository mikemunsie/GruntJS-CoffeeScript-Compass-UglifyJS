/* 
 * Compile Coffeescript, MinifyJS, and Compass Watch Build/Watch Script
 * Created by Michael Munsie
 *
 * This configuration will assume your folder structure is:
 *
 * css
 * coffee
 * js
 * js-ext
 * sass
 *
 */

require('./helpers.js');

module.exports = function(grunt) {
  grunt.initConfig({
    webapp: "../../", // Must have a / at the end ;)
    watch: {
      coffee: {
        files: ['<%= webapp %>coffee/**/*.coffee'],
        tasks: ['coffee','uglify'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['<%= webapp %>sass/**/*.sass'],
        tasks: ['compass']
      }
    },
    coffee: {
      compile: {
        expand: true,
        flatten: false,
        cwd: '<%= webapp %>coffee/',
        src: ['**/*.coffee'],
        dest: '<%= webapp %>js/',
        ext: '.js'
      }
    },
    uglify: {
      packageLoginLayout: {
        files: {
          "<%= webapp %>js/package-loginLayout.js": [
            "<%= webapp %>js-ext/foutbgone.js.js",
            "<%= webapp %>js-ext/json2-min.js",
            "<%= webapp %>js-ext/jquery.pseudo.js",
            "<%= webapp %>js/staticContent-analytics.js",
            "<%= webapp %>js-ext/knockout-2.2.0.js",
            "<%= webapp %>js-ext/l10n-min.js",
            "<%= webapp %>js-ext/modal.js",
            "<%= webapp %>js-ext/jquery.cookie-min.js",
            "<%= webapp %>js/api.js",
            "<%= webapp %>js/l10.js",
            "<%= webapp %>js/helpers.js",
            "<%= webapp %>js/customBindings.js",
            "<%= webapp %>js/notifications.js",
            "<%= webapp %>js/loading.js",
            "<%= webapp %>js/jsUtils.js",
            "<%= webapp %>js/passwordValidation.js",
            "<%= webapp %>js/deleteCookies.js"
          ]
        },
        options: {
          mangle: false,
          preserveComments: true
        },
      },
      customBindings: {
        files: {
          "<%= webapp %>js/customBindings.js": ["<%= webapp %>js/customBindings/*.js"]
        },
        options: {
          mangle: false,
          preserveComments: true
        },
      },
      allFiles: {
        files: [{
          expand: true,
          cwd: '<%= webapp %>js/',
          src: '**/*.js',
          dest: '<%= webapp %>js/'
        }],
        options: {
          mangle: false,
          preserveComments: true
        }
      },
      individual: {
        options: {
          mangle: false,
          preserveComments: true
        }
      }
    },
    compass: {
      dist: {
        options: {
          basePath: '<%= webapp %>',
          sassDir: 'sass',
          cssDir: 'css'
        }
      }
    }
  });

  grunt.event.on('watch', function(action, filepath) {
    switch(getExtension(filepath)){
      case "coffee":

        // Coffee Configuration
        var coffeeFilePath = filepath.replace(grunt.config("coffee.compile.cwd"), '');
        grunt.config("coffee.compile.src", coffeeFilePath);

        // Uglify Configuration
        var uglifyFileName = grunt.config("webapp") + filepath
          .replace(/(.+)\.coffee$/, 'js/$1.js')
          .replace(grunt.config("coffee.compile.cwd"), '')
          .replace(".coffee", ".js");
        var uglifyFilePath = uglifyFileName.replace("js","js");
        var uglifyObj = {};
        uglifyObj.files = {};
        uglifyObj.files[uglifyFileName] = uglifyFilePath;
        grunt.config("uglify.allFiles.files", []);
        grunt.config("uglify.individual", uglifyObj);
        break;
    }
  });

  // Load Grunt Libs
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default tasks on load
  grunt.registerTask('default', ['coffee','uglify','compass']);
};