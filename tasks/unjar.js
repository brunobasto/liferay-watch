'use strict';

var bnd = require('./lib/bnd');
var gogo = require('./lib/gogo');
var configs = require('./lib/configs');
var gulp = require('gulp');
var path = require('path');
var unzip = require('gulp-unzip');

gulp.task('unjar', [], function(done) {
	console.log('[unjar] Unpacking deployed bundle...');

	bnd.getJarName(process.cwd(), function(jarName) {
		gogo.getLiferayHome(function(liferayHome) {
			var jarPath = path.join(liferayHome, 'osgi/modules', jarName);

			gulp.src(jarPath)
			.pipe(unzip())
			.pipe(gulp.dest(path.resolve(configs.pathExploded)))
			.on('end', function() {
				console.log('[unjar] Done.');

				done();
			});
		});
	});
});