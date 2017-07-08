'use strict';

const childProcess = require('child_process');

module.exports = () => {
	return new Promise((resolve, reject) => {
		if (global.projectDeps) {
			resolve(global.projectDeps);
		}
		else {
			const cp = childProcess.spawn('gradle', ['dependencies', '--configuration', 'compile'], { cwd: process.cwd() });
			let gradleOutput = '';
			cp.stdout.on('data', (data) => {
				gradleOutput += data.toString();
			});
			cp.stderr.pipe(process.stderr);
			cp.on('exit', (code) => {
				if (code === 0) {
					let projectDeps = gradleOutput.split('\n')
					.filter(line => line.indexOf('project :') > -1)
					.map(depLine => depLine.replace(/(\+|\\)\-\-\- project /, ''));
					global.projectDeps = projectDeps;
					resolve(projectDeps);
				}
				else {
					reject(new Error('Unable to call gardle to get compile dependencies.'));
				}
			});
		}
	});
};