'use strict';

const buildAmd = require('metal-tools-build-amd/lib/pipelines/buildAmd');
const cache = require('gulp-cached');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const replaceAmdDefine = require('./lib/replaceAmdDefine');
const tap = require('gulp-tap');
const filter = require('gulp-filter');

gulp.task('build-javascript', (done) => {
	gutil.log(gutil.colors.magenta('javascript'), 'Transpiling files. This may take a while.');
	return gulp.src([configs.globJs])
	.pipe(cache('build-javascript'))
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
	.pipe(filter(['**/*.js', '!**/*.soy.js']))
	.pipe(buildAmd({
		cacheNamespace: 'transpile',
		moduleName: ''
	}))
	.pipe(tap((file) => {
		file.path = file.path.replace(path.join(configs.pathExploded, 'META-INF/resources'), '');
	}))
	.pipe(replaceAmdDefine())
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
	.pipe(duration('javascript'));
});