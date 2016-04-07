'use strict';

var config = require('../config');
var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');

gulp.task('build-sass', [], function(done) {
	console.log('[SASS] Copying files...');
	gulp.src(config.globSass)
	.pipe(sass({
		includePaths: ['build/portal-common-css']
	}))
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', function() {
		console.log('[SASS] Done.');
		done();
	});
});