'use strict';

const buildAmd = require('metal-tools-build-amd/lib/pipelines/buildAmd');
const childProcess = require('child_process');
const clean = require('gulp-clean');
const compileSoy = require('metal-tools-soy/lib/pipelines/compileSoy');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const fs = require('fs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const path = require('path');
const plumber = require('gulp-plumber');
const readJson = require('read-package-json');
const runSequence = require('run-sequence');
const tap = require('gulp-tap');
const cache = require('gulp-cached');
const through = require('through2')

function handleError(error) {
	const source = error.plugin || 'metal-tools-soy';
	console.error(new gutil.PluginError(source, error.message).toString());
	this.emit('end'); // jshint ignore:line
}
function getSoyDeps(cb) {
	if (global.soyDeps) {
		cb(global.soyDeps);
	}
	else {
		// Gets soyDeps from gradle
		const cp = childProcess.spawn('gradle', ['dependencies', '--configuration', 'soyCompile'], { cwd: process.cwd() });
		let gradleOutput = '';
		cp.stdout.on('data', (data) => {
			gradleOutput += data.toString();
		});
		cp.on('exit', (code) => {
			if (code === 0) {
				const makeSoyDepGlob = dep => path.join('build', dep, 'META-INF/resources', '**/*.soy');
				let soyDeps = Object.keys(configs.soyCompile || []).map(makeSoyDepGlob);
				soyDeps = soyDeps.concat(
					gradleOutput.split('\n')
					.filter(line => line.indexOf('\\--- ') === 0)
					.map(depLine => depLine.replace('\\--- ', '').split(':')[1])
					.map(makeSoyDepGlob)
					.filter(dep => soyDeps.indexOf(dep) === -1)
				);
				soyDeps.push(
					'node_modules/lexicon*/src/**/*.soy',
					'node_modules/metal*/src/**/*.soy'
				);
				global.soyDeps = soyDeps;
				cb(soyDeps);
			}
			else {
				cb([]);
			}
		});
	}
}

getSoyDeps(() => {});

gulp.task('soy-copy', (done) => {
	return gulp.src(configs.globSoy)
	.pipe(gulp.dest(path.join(process.cwd(), configs.pathExploded, 'META-INF/resources')))
});

gulp.task('soy-compile', (done) => {
	let moduleName = '';
	let moduleVersion = '';
	readJson(path.join(process.cwd(), 'package.json'), console.error, false, (er, data) => {
		if (er) {
			console.error("There was an error reading package.json")
			return
		}
		moduleName = data.name;
		moduleVersion = data.version;
	});

	gutil.log(gutil.colors.magenta('soy'), 'Compiling soy files. This may take a while.');
	return gulp.src(configs.globSoy)
	.pipe(gulp.dest(path.join(process.cwd(), configs.pathExploded, 'META-INF/resources')))
	.pipe(
		compileSoy({
			handleError: handleError,
			skipMetalGeneration: false,
			soyDeps: global.soyDeps,
			src: configs.globSoy
		})
	)
	.pipe(cache('soy-compile'))
	.pipe(through.obj(function(file, enc, cb) {
		fs.writeFile(file.path, file.contents, () => cb(null, file));
	}))
	.pipe(buildAmd({
		base: path.join(configs.pathExploded, 'META-INF/resources'),
		cacheNamespace: 'soy-transpile',
		moduleName: ''
	}))
	.pipe(tap((file) => {
		const resourcesPath = path.relative(
			process.cwd(),
			file.path.replace(configs.pathExploded + '/META-INF/resources', '').replace('.js', '')
		);
		file.contents = new Buffer(String(file.contents)
			.replace(/define\(\[/g, 'Liferay.Loader.define("' + moduleName + '@' + moduleVersion + '/' + resourcesPath + '", [')
		);
	}))
	.pipe(gulp.dest(path.join(configs.pathExploded, 'META-INF/resources')))
	.pipe(duration('soy-compile'));
});

gulp.task('build-soy', (done) => {
	runSequence('soy-copy', 'soy-compile', () => done());
});