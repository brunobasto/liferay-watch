'use strict';

const configs = require('./lib/configs');
const duration = require('gulp-duration');
const fs = require('fs');
const gogo = require('./lib/gogo');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const unzip = require('gulp-unzip');

let sassTimer = duration('sass');

gulp.task('unzip-portal-common-css', [], (done) => {
	sassTimer.start();
	gutil.log(gutil.colors.magenta('sass'), 'Extracting portal common CSS');
	fs.stat('build/portal-common-css', (err, stats) => {
		if (stats && stats.isDirectory()) {
			done();
			return;
		}
		gogo.getLiferayHome()
		.then((liferayHome) => {
			gulp.src(path.join(liferayHome, 'osgi/modules', 'com.liferay.frontend.css.common.jar'))
			.pipe(unzip({
				filter: (entry) => {
					return entry.path.indexOf('META-INF/resources/') == 0;
				}
			}))
			.pipe(rename((entry) => {
				entry.dirname = entry.dirname.substring('META-INF/resources/'.length);
			}))
			.pipe(gulp.dest('build/portal-common-css'))
			.on('end', () => done());
		})
	});
});

gulp.task('build-sass', ['unzip-portal-common-css'], (done) => {
	gutil.log(gutil.colors.magenta('sass'), 'Processing files');
	return gulp.src(configs.globSass)
	.pipe(sass({
		includePaths: ['build/portal-common-css']
	}))
	.pipe(sassTimer)
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
});