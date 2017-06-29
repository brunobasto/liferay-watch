'use strict';

var config = require('./lib/configs');
var fs = require('fs');
var gogo = require('./lib/gogo');
var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var unzip = require('gulp-unzip');

gulp.task('unzip-portal-common-css', [], function(done) {
	fs.stat('build/portal-common-css', function(err, stats) {
		if (stats && stats.isDirectory()) {
			done();
			return;
		}

		console.log('[SASS] Unzipping portal-common-css...');
		gogo.getLiferayHome(function(liferayHome) {
			var jarPath = path.join(liferayHome, 'osgi/modules', 'com.liferay.frontend.css.common.jar');

			gulp.src(jarPath)
			.pipe(unzip({
				filter: function(entry) {
					return entry.path.indexOf('META-INF/resources/') == 0;
				}
			}))
			.pipe(rename(function(entry) {
				entry.dirname = entry.dirname.substring('META-INF/resources/'.length);
			}))
			.pipe(gulp.dest('build/portal-common-css'))
			.on('end', done);
		});
	});
});

gulp.task('build-sass', ['unzip-portal-common-css'], function(done) {
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