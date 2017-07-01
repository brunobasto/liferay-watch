'use strict';

const browserSync = require('browser-sync').create('liferay-watch');
const configs = require('./lib/configs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const pretty = require('pretty-hrtime');
const runSequence = require('run-sequence');

gulp.task('build', (done) => {
	Promise.all([
		new Promise((resolve) => runSequence('build-java', resolve)),
		new Promise((resolve) => runSequence('build-javascript', resolve)),
		new Promise((resolve) => runSequence('build-jsp', resolve)),
		new Promise((resolve) => runSequence('build-sass', resolve)),
		new Promise((resolve) => runSequence('build-soy', resolve))
	])
	.then(() => done());
});

gulp.task('watch', ['unjar'], function(done) {
	const timeStart  = process.hrtime();
	runSequence(
		'build',
		'install', 
		() => {
			const duration = pretty(process.hrtime(timeStart));
			const gulpPrefix = '[' + gutil.colors.green('gulp') + ']';
			console.log(gulpPrefix + ' startup took:', gutil.colors.magenta(duration));
			gutil.log(gutil.colors.magenta('watch'), 'Listening for changes');
			if (global.browserSync) {
				runSequence('browser-sync');
			}
			gulp.task('watch-java', () => runSequence('build-java', 'install'));
			gulp.watch(configs.globJava, ['watch-java']);
			gulp.watch(configs.globJs, ['build-javascript']);
			gulp.task('watch-jsp', () => runSequence('build-jsp', 'install'));
			gulp.watch(configs.globJsp, ['watch-jsp']);
			gulp.watch(configs.globSass, ['build-sass']);
			gulp.watch(configs.globSoy, ['build-soy']);
			process.on('exit', function() {
				console.log('we should link the bundle back to the jar at this point.');
			});
			done();
		}
	);
});

gulp.task('browser-sync', function() {
	browserSync.init({
		files: [{
			match: path.join(configs.pathExploded, '**/*.*'),
			options: {
				ignored: '**/*.jsp'
			}
		}],
		rewriteRules: [
			{
				match: /8080/g,
				replace: '8081'
			}
		],
		proxy: {
			target: 'localhost:8080',
			ws: true
		},
		open: false,
		port: 8081,
		ui: false,
		reloadDelay: 500,
		reloadOnRestart: true
	});
});