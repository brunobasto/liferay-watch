var path = require('path');
var fs = require('fs');

var userConfigsPath = path.join(process.cwd(), '.lwatch.json');
var userConfigs = {};

if (fs.existsSync(userConfigsPath)) {
	userConfigs = require(userConfigsPath);
}

var g2js = require('gradlejs');
var buildGradlePath = path.join(process.cwd(), 'build.gradle');

g2js.parseFile(buildGradlePath).then(function(json) {
	// console.log('[Configs] jsCompile:', json.dependencies['\tjsCompile']);
	// console.log('[Configs] soyCompile:', json.dependencies['\tsoyCompile']);
});

const configs = Object.assign(require('../../config.json'), userConfigs);

console.log('[Configs]', configs);

module.exports = configs;