"use strict";

var gulp = require('gulp'),
	less = require('gulp-less'),
	debug = require('gulp-debug'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	combineMq = require('gulp-combine-mq'),
	concat = require('gulp-concat'),
	jsmin = require('gulp-jsmin'),
	browserSync = require('browser-sync').create();


gulp.task('clean', function() {
	return del(['public/css']);
});

gulp.task('cleanall', function() {
	return del(['public/css', 'public/js']);
});

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('styles', function() {
	return gulp.src('less/style.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(debug({title: 'LESS'}))
		.pipe(autoprefixer())  // title is option you can look it up in API documentation
		.pipe(debug({title: 'autoprefixed'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
	gulp.watch(['less/**/*.*', 'js/**/*.*'], gulp.series('styles', 'scripts'));
});

gulp.task('combineMQ', function() {
	return gulp.src('public/css/style.css')
		  .pipe(combineMq({
		  	beautify: false
		  }))
		  .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function(){
	return gulp.src(['bower_components/es5-shim/es5-shim.min.js',
					 'bower_components/html5shiv/dist/html5shiv.min.js',
					 'bower_components/svg4everybody/dist/svg4everybody.min.js',
					 'bower_components/respond/dest/respond.min.js',
					 'bower_components/morpheus/morpheus.min.js',
					 'js/swipe.js',
					 'js/action.js'
					 ])
		  .pipe(sourcemaps.init())
		  .pipe(concat('main.js'))
		  .pipe(sourcemaps.write('.'))
		  .pipe(debug({title: 'concatenate'}))
		  .pipe(jsmin())
		  .pipe(debug({title: 'JS minification'}))
		  .pipe(gulp.dest('public/js'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles')));

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));

gulp.task('production', gulp.series('cleanall', 'scripts', gulp.parallel('styles'), 'combineMQ'));