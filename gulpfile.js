var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


var jsFiles = "./src/*.js";
var viewFiles = './views/**';
var publicFiles = './public/**';

gulp.task('lint', function() {
	gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('viewsBuild', function() {
	gulp.src(viewFiles)
		.pipe(gulp.dest('./build/views'));

	gulp.src(publicFiles)
		.pipe(gulp.dest('./build/public'));
});

gulp.task('jsBuild', function() {
	gulp.src(jsFiles)
		.pipe(rename({
		    suffix: ".min",
	    	extname: ".js"
  		}))
		.pipe(uglify())
		.pipe(gulp.dest('./build'));
});

gulp.task('default', function() {
	gulp.run('lint', 'viewsBuild', 'jsBuild');
});