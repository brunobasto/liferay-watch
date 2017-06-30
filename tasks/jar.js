'use strict';

const bnd = require('./lib/bnd');
const config = require('./lib/configs');
const gogo = require('./lib/gogo');
const gulp = require('gulp');
const path = require('path');
const zip = require('gulp-zip');

gulp.task('jar', [], function(done) {
	const explodedDir = path.resolve(config.pathExploded);
	console.log('[jar] Packaging jar...');
	bnd.getJarName(process.cwd(), function(jarName) {
		gogo.getLiferayHome(function(liferayHome) {
			const jarFolder = path.join(liferayHome, 'osgi/modules');
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