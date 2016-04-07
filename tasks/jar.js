'use strict';

var bnd = require('./lib/bnd');
var config = require('../config');
var gogo = require('./lib/gogo');
var gulp = require('gulp');
var path = require('path');
var zip = require('gulp-zip');

gulp.task('jar', [], function(done) {
	var explodedDir = path.resolve(config.pathExploded);

	console.log('[jar] Packaging jar...');

	bnd.getJarName(process.cwd(), function(jarName) {
		gogo.getLiferayHome(function(liferayHome) {
			var jarFolder = path.join(liferayHome, 'osgi/modules');

			gulp.src(explodedDir + '/**/*.*')
			.pipe(zip(jarName))
			.pipe(gulp.dest(jarFolder))
			.on('end', function() {
				console.log('[jar] Done.');

				done();
			});
		});
	});
});