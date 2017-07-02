'use strict';

const fs = require('fs');
const gutil = require('gulp-util');
const path = require('path');

const userConfigsPath = path.join(process.cwd(), '.lwatch.json');
let userConfigs = {};
if (fs.existsSync(userConfigsPath)) {
	userConfigs = require(userConfigsPath);
}
const configs = Object.assign(require('../../config.json'), userConfigs);
gutil.log(gutil.colors.magenta('configs'), configs);
module.exports = configs;