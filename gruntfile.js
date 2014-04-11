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