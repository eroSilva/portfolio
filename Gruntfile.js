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


		// Critical CSS
		// @url: https://www.npmjs.com/package/grunt-criticalcss
		criticalcss: {
		    site: {
	            options: {
	                url: 'http://localhost/portfolio',
	                width: 1366,
	                height: 2000,
	                outputfile: 'assets/css/critical/critical.css',
	                filename: 'assets/css/app.css',
	                buffer: 800*1240,
	                ignoreConsole: false
	            }
	        }
		},


		// CSS Min
		// @url: https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
		  	site: {
	      		expand: true,
			    cwd: 'assets/css/critical/',
			    src: ['*.css'],
			    dest: 'assets/css/critical/',
			    ext: '.min.css'
		  	}
		}
	});


	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-criticalcss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	// Define tasks
	grunt.registerTask('site', ['browserSync:site', 'compass:site']);
	grunt.registerTask('critical', ['criticalcss:site', 'cssmin:site']);
};