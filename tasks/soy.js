'use strict';

const buildAmd = require('metal-tools-build-amd/lib/pipelines/buildAmd');
const cache = require('gulp-cached');
const compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const replaceAmdDefine = require('./lib/replaceAmdDefine');

gulp.task('build-soy', () => {
	gutil.log(gutil.colors.magenta('soy'), 'Compiling soy files. This may take a while.');
	return gulp.src(configs.globSoy)
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
	.pipe(compileSoy({
		handleError: error => console.error(error),
		soyDeps: configs.soyDeps,
		src: configs.globSoy
	}))
	.pipe(cache('build-soy'))
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
	.pipe(buildAmd({
		base: path.join(configs.pathExploded, 'META-INF/resources'),
		cacheNamespace: 'transpile',
		moduleName: ''
	}))
	.pipe(replaceAmdDefine())
	.pipe(duration('soy-compile'))
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')));
});