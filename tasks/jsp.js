'use strict';

var config = require('../config');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');

gulp.task('build-jsp', [], function(done) {
	console.log('[JSP] Copying files...');
	gulp.src(config.globJsp)
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', function() {
		runSequence('install', function() {
			console.log('[JSP] Done.');
			done();
		});
	});
});