'use strict';

const childProcess = require('child_process');
const configs = require('./lib/configs');
const duration = require('gulp-duration');
const gulp = require('gulp');
const gutil = require('gulp-util');
const projectDeps = require('./lib/projectDeps');

const buildGradleArgs = (projects) => {
	const skippedTasks = [
		'transpileJS', 'configJSModules', 'npmInstall', 'downloadMetalCli', 'buildCSS', 'downloadNode', 'jar'
	];
	const args = ['compileJava'];
	projects.forEach((project) => skippedTasks.forEach((task) => {
		args.push('-x');
		args.push(project + ':' + task);
	}));
	skippedTasks.forEach((task) => {
		args.push('-x');
		args.push(task);
	});
	return args;
};

gulp.task('build-java', (done) => {
	const javaTimer = duration('java');
	projectDeps().then((projects) => {
		gutil.log(gutil.colors.magenta('java'), 'Compiling Java');
		const cp = childProcess.spawn('gradle', buildGradleArgs(projects), { cwd: process.cwd() });
		let stdErr = '';
		cp.stderr.on('data', (chunk) => {
			stdErr += chunk.toString();
		});
		cp.on('exit', (code) => {
			if (code === 0) {
				gulp.src(configs.globClass)
				.pipe(javaTimer)
				.pipe(gulp.dest(configs.pathExploded))
				.on('end', () => done());
			}
			else {
				console.log(stdErr);
				gutil.log(gutil.colors.magenta('java'), gutil.colors.red('Errors compiling Java. Check compiler output.'));
				done();
			}
		});
	});
});