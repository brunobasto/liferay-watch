#!/usr/bin/env node

var gulp = require('gulp');

var yargs = require('yargs')
	.usage('Usage: lwatch [options]')
	.boolean('browser')
	.alias('b', 'browser')
	.describe('browser', 'Refreshes browser whenever a change is detected')
	.alias('v', 'version')
	.describe('version', 'Prints current version')
	.help('h')
	.epilog('Copyright 2016')
	.version(function() {
		return require('../package').version;
	});

require('../gulpfile');

if (yargs.argv.browser) {
	global.browserSync = true;
}

gulp.start.apply(gulp, ['watch']);