'use strict';

const configs = require('./configs');
const path = require('path');
const gradleChildProcess = require('./gradleChildProcess');

module.exports = () => {
	return new Promise((resolve, reject) => {
		if (global.soyDeps) {
			resolve(global.soyDeps);
		}
		else {
			const cp = gradleChildProcess(['dependencies', '--configuration', 'soyCompile']);
			let gradleOutput = '';
			cp.stdout.on('data', (data) => {
				gradleOutput += data.toString();
			});
			cp.stderr.pipe(process.stderr);
			cp.on('exit', (code) => {
				if (code === 0) {
					const makeSoyDepGlob = dep => path.join('build', dep, 'META-INF/resources', '**/*.soy');
					let soyDeps = Object.keys(configs.soyCompile || []).map(makeSoyDepGlob);
					soyDeps = soyDeps.concat(
						gradleOutput.split('\n')
						.filter(line => line.indexOf('\\--- ') === 0)
						.map(depLine => depLine.replace('\\--- ', '').split(':')[1])
						.map(makeSoyDepGlob)
						.filter(dep => soyDeps.indexOf(dep) === -1)
					);
					soyDeps.push(
						'node_modules/lexicon*/src/**/*.soy',
						'node_modules/metal*/src/**/*.soy'
					);
					global.soyDeps = soyDeps;
					resolve(soyDeps);
				}
				else {
					reject(new Error('Unable to call gardle to get soy dependencies.'));
				}
			});
		}
	});
};