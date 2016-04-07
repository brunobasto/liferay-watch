'use strict';

var config = require('../config');
var gulp = require('gulp');
var path = require('path');

gulp.task('build-javascript', [], function(done) {
	console.log('[JavaScript] Copying files...');
	gulp.src(config.globJs)
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', function() {
		console.log('[JavaScript] Done.');
		done();
	});
});