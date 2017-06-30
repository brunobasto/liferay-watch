'use strict';

const bnd = require('./lib/bnd');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gogo = require('./lib/gogo');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const unzip = require('gulp-unzip');

gulp.task('unjar', [], function(done) {
	const unjarTimer = duration('unjar');
	gutil.log(gutil.colors.magenta('unjar'), 'Unpacking deployed bundle');
	bnd.getJarName(process.cwd(), function(jarName) {
		gogo.getLiferayHome(function(liferayHome) {
			gulp.src(path.join(liferayHome, 'osgi/modules', jarName))
			.pipe(unzip())
			.pipe(unjarTimer)
			.pipe(gulp.dest(path.resolve(configs.pathExploded)))
			.on('end', () => done());
		});
	});
});