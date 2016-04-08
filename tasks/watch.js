'use strict';

var browserSync = require('browser-sync').create('liferay-watch');
var config = require('../config');
var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');

gulp.task('watch', [], function(done) {
	runSequence('unjar', 'build-sass', 'build-javascript', 'build-jsp', 'browser-sync', function() {
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

gulp.task('browser-sync', function() {
	browserSync.init({
		files: [{
			match: path.join(config.pathExploded, '**/*.*'),
			options: {
				ignored: '**/*.jsp'
			}
		}],
		proxy: {
			target: 'http://localhost:8080',
			ws: true
		},
		open: false,
		port: 8081,
		ui: false,
		reloadDelay: 500,
		reloadOnRestart: true
	});
});