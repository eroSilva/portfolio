module.exports = function(grunt) {


	// URLS
	var sitePublic     = 'assets';
	var siteView       = 'views';


	// Project configuration.
	grunt.initConfig({
		// Compass
        // @url: http://compass-style.org/
		compass: {                 
		    site: {                 
				options: {
					sassDir     : sitePublic + '/scss',
					cssDir      : sitePublic + '/css',
					watch       : true,
					sourcemap   : true,
					environment : 'production'
				}
		    }
		},

		// Browser-Sync
        // @url: https://www.browsersync.io/
		browserSync: {
		    site: {
		        bsFiles: {
		            src : [
		            	sitePublic + '/css/*.css',
		            	sitePublic + '/css/**/*.css',
		            	sitePublic + '/js/*.js',
		            	sitePublic + '/js/**/*.js',

		            	siteView + '/**/*.php',
		            	siteView + '/**/*.html',
		            	siteView + '/**/*.phtml',
		            ]
		        },
		        options: {
		        	online: true,
		        	watchTask: true,
		            proxy: "localhost/portfolio"
		        }
		    }
		},


		// Uglify
		// @url: https://www.npmjs.com/package/grunt-contrib-uglify
		uglify: {
			options: {
	        	sourceMap: true
			},
			site: {
				files: [{
					src: [''],
					dest: ''
				}]
			}
		}
	});


	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	// Define tasks
	grunt.registerTask('site', ['browserSync:site', 'compass:site']);
};