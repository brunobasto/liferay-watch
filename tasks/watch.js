'use strict';

var config = require('../config');
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('watch', [], function(done) {
	runSequence('unjar', 'build-sass', 'build-javascript', 'build-jsp', function() {
		console.log('[lwatch] Listening for changes...');

		gulp.watch(config.globSass, function(){
			runSequence('build-sass');
		});
		gulp.watch(config.globJs, function() {
			runSequence('build-javascript');
		});
		gulp.watch(config.globJsp, function() {
			runSequence('build-jsp');
		});
		gulp.watch(config.globSoy, function() {
			runSequence('build-soy');
		});

		process.on('exit', function() {
			console.log('we should link the bundle back to the jar ati this point.');
		});

		done();
	});
});
