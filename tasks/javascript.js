'use strict';

const buildAmd = require('metal-tools-build-amd/lib/pipelines/buildAmd');
const config = require('./lib/configs');
const duration = require('gulp-duration');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const readJson = require('read-package-json');
const tap = require('gulp-tap');

gulp.task('build-javascript', [], function(done) {
	gutil.log(gutil.colors.magenta('javascript'), 'Transpiling files. This may take a while.');
	let moduleName = '';
	let moduleVersion = '';
	readJson(path.join(process.cwd(), 'package.json'), console.error, false, function (er, data) {
		if (er) {
			console.error("There was an error reading package.json")
			return
		}

		moduleName = data.name;
		moduleVersion = data.version;
	});

	gulp.src([config.globJs])
	.pipe(buildAmd({moduleName: ''}))
	.pipe(tap(function(file) {
		file.path = file.path.replace('META-INF/resources/src/main/resources/META-INF', 'META-INF');

		const resourcesPath = path.relative(
			process.cwd(),
			file.path.replace('src/main/resources/META-INF/resources', '').replace('.js', '')
		);

		file.contents = new Buffer(String(file.contents)
			.replace(/define\(\[/g, 'Liferay.Loader.define("' + moduleName + '@' + moduleVersion + '/' + resourcesPath + '", [')
		);
	}))
	.pipe(duration('javascript'))
	.pipe(gulp.dest(path.join(config.pathExploded, 'META-INF/resources')))
	.on('end', () => done());
});