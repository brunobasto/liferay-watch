'use strict';

var config = require('../config');
var gulp = require('gulp');
var path = require('path');

gulp.task('build-soy', [], function(done) {
	console.log('[Soy] Copying files...');
	gulp.src(config.globSoy)
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', function() {
		console.log('[Soy] Done.');
		done();
	});
});