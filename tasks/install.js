'use strict';

const bnd = require('./lib/bnd');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gogo = require('./lib/gogo');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const pretty = require('pretty-hrtime');

gulp.task('install', [], () => {
	const timeStart  = process.hrtime();
	const explodedDir = path.resolve(configs.pathExploded);
	gutil.log(gutil.colors.magenta('install'), 'Installing bundle');
	return bnd.getSymbolicName(process.cwd())
	.then((symbolicName) => gogo.getBundleId(symbolicName))
	.then((bundleId) => gogo.install(bundleId, explodedDir))
	.then(() => {
		const duration = pretty(process.hrtime(timeStart));
		const gulpPrefix = '[' + gutil.colors.green('gulp') + ']';
		console.log(gulpPrefix + ' install:', gutil.colors.magenta(duration));
		return true;
	});
});