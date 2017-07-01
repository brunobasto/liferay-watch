'use strict';

const browserSync = require('browser-sync');
const config = require('./lib/configs');
const duration = require('gulp-duration');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');

gulp.task('build-jsp', [], function(done) {
	const buildJspTimer = duration('jsp');
	gutil.log(gutil.colors.magenta('jsp'), 'Copying files');
	gulp.src(config.globJsp)
	.pipe(buildJspTimer)
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', () => {
		if (global.browserSync) {
			browserSync.get('liferay-watch').reload();
		}
		done();
	});
});