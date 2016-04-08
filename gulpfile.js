var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');


var files = "./src/*.js";

gulp.task('lint', function() {
	gulp.src(files)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
	gulp.src(files)
		.pipe(rename({
		    suffix: ".min",
	    	extname: ".js"
  		}))
		.pipe(uglify())
		.pipe(gulp.dest('./build'));
});

gulp.task('default', function() {
	gulp.run('lint', 'build');
});