const fs = require('fs');
const g2js = require('gradlejs');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');

const userConfigsPath = path.join(process.cwd(), '.lwatch.json');
let userConfigs = {};
if (fs.existsSync(userConfigsPath)) {
	userConfigs = require(userConfigsPath);
}
const buildGradlePath = path.join(process.cwd(), 'build.gradle');
g2js.parseFile(buildGradlePath).then(function(json) {
	gutil.log(gutil.colors.magenta('configs'), gutil.colors.green('jsCompile'), json.dependencies['\jsCompile']);
	gutil.log(gutil.colors.magenta('configs'), gutil.colors.green('soyCompile'), json.dependencies['\tsoyCompile']);
});
const configs = Object.assign(require('../../config.json'), userConfigs);
gutil.log(gutil.colors.magenta('configs'), configs);
module.exports = configs;