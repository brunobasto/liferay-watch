#!/usr/bin/env node

var gulp = require('gulp');

var yargs = require('yargs')
	.string('_')
	.usage('lwatch [command] [options]')
	.alias('v', 'version')
	.describe('version', 'Prints current version')
	.help('h')
	.epilog('Copyright 2016')
	.version(function() {
		return require('../package').version;
	});

require('../gulpfile');

for (var task in gulp.tasks) {
	yargs.command(task, 'Gulp task');
}

var argv = yargs.argv;

gulp.start.apply(gulp, argv._);