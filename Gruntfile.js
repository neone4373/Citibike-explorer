module.exports = function(grunt) {


	grunt.initConfig({
	        pkg: grunt.file.readJSON('package.json'),

	        concat: {
	            // 2. Configuration for concatinating files goes here.
	        },

   imagemin: {
      dynamic: {
        files: [{
          expand: true,
          src: ['intro/*.{png,jpg,gif}'],
          dest: 'img/'
        }]
      }
    },
    combine_mq: {
      default_options: {
        expand: true,
        src: 'style/*.css',
        dest: 'style/dist'
      }
    },
    uncss: {
      dist: {
        files: {
          'dist/css/tidy.css': ['index.html']
        }
      }
    }
  });

  //grunt.loadNpmTasks('grunt-combine-mq');
	//grunt.loadNpmTasks('grunt-contrib-imagemin');
  //grunt.loadNpmTasks('grunt-uncss');
	grunt.registerTask('default');

};