'use strict';

var bnd = require('./lib/bnd');
var config = require('../config');
var gogo = require('./lib/gogo');
var gulp = require('gulp');
var path = require('path');

gulp.task('install', [], function(done) {
	var explodedDir = path.resolve(config.pathExploded);

	console.log('[install] Installing unpacked bundle...');

	bnd.getSymbolicName(process.cwd(), function(symbolicName) {
		gogo.getBundleId(symbolicName, function(bundleId) {
			gogo.install(bundleId, explodedDir, function() {
				console.log('[install] Done.');

				done();
			});
		});
	});
});