'use strict';

const bnd = require('./lib/bnd');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gogo = require('./lib/gogo');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const unzip = require('gulp-unzip');

gulp.task('unjar', (done) => {
	const unjarTimer = duration('unjar');
	gutil.log(gutil.colors.magenta('unjar'), 'Unpacking deployed bundle');
	const info = {};
	return bnd.getJarName(process.cwd())
	.then((jarName) => {
		info.jarName = jarName;
		return gogo.getLiferayHome();
	})
	.then((liferayHome) => new Promise((resolve, reject) => {
		gulp.src(path.join(liferayHome, 'osgi/modules', info.jarName))
		.pipe(unzip())
		.pipe(unjarTimer)
		.pipe(gulp.dest(path.resolve(configs.pathExploded)))
		.on('end', () => resolve());
	}))
	.catch((error) => console.error(error));
});