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
  }
  });


	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.registerTask('default', ['imagemin']);

};