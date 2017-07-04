'use strict';

const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');

let configs = require('../../config.json');
const userConfigsPath = path.resolve(require('os').homedir(), '.lwatch.json');
if (fs.existsSync(userConfigsPath)) {
	configs = Object.assign(configs, require(userConfigsPath));
}
const projectConfigsPath = path.join(process.cwd(), '.lwatch.json');
if (fs.existsSync(projectConfigsPath)) {
	configs = Object.assign(configs, require(projectConfigsPath));
}
gutil.log(gutil.colors.magenta('configs'), configs);
module.exports = configs;