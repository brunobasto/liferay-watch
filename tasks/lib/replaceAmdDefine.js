'use strict';

const configs = require('./configs');
const path = require('path');
const tap = require('gulp-tap');
const readJson = require('read-package-json');

let moduleName = '';
let moduleVersion = '';
readJson(path.join(process.cwd(), 'package.json'), console.error, false, (er, data) => {
	if (er) {
		console.error("There was an error reading package.json");
		return;
	}
	moduleName = data.name;
	moduleVersion = data.version;
});

module.exports = () => tap((file) => {
	const resourcesPath = path.relative(
		process.cwd(),
		file.path.replace(configs.pathExploded + '/META-INF/resources', '').replace('.js', '')
	);
	file.contents = new Buffer(String(file.contents)
		.replace(/define\(\[/g, 'Liferay.Loader.define("' + moduleName + '@' + moduleVersion + '/' + resourcesPath + '", [')
	);
});