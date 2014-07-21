module.exports = function (grunt) {
	//Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				strict: false
			},
			all: ['GruntFile.js', 'js/<%= pkg.name %>.js']
		},
		uglify: {
			all: {
				files: {
					'js/<%= pkg.name %>.min.js': 'js/<%= pkg.name %>.js'
				}
			}
		},
		smushit: {
			path: {
				src: 'img/'
			}
		}
	});
	//Plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-smushit');

	//Tasks
	grunt.registerTask('default', ['jshint', 'uglify', 'smushit']);
};