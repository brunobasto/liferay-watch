'use strict';

const GogoShell = require('gogo-shell');
const configs = require('./configs');

module.exports = {
	getBundleId: (symbolicName) => {
		const gogoShell = new GogoShell();
		const command = 'lb -s ' + symbolicName + ' | grep Active';
		return gogoShell
		.connect({ port: configs.gogoPort })
		.then(() => gogoShell.sendCommand(command))
		.then((data) => {
			gogoShell.end();
			const info = data.split('\n')
			.filter((line) => line.indexOf(symbolicName) > -1 && line.trim() !== command)
			.map(line => line.trim());
			if (info.length === 0) {
				throw new Error('Could not find installed bundle.');
			}
			return info[0].split('|').shift();
		});
	},

	getLiferayHome: () => {
		const gogoShell = new GogoShell();
		const command = 'equinox:props';
		return gogoShell
		.connect({ port: configs.gogoPort })
		.then(() => gogoShell.sendCommand(command))
		.then((data) => {
			gogoShell.end();
			const info = data.split('\n')
			.filter(line => line.indexOf('liferay.home') > -1)
			.map(line => line.trim());
			if (info.length === 0) {
				throw new Error('Could not find liferay.home.');
			}
			return info[0].split('=').pop().trim();
		});
	},

	install: (bundleId, dir) => {
		const gogoShell = new GogoShell();
		const command = [
			'update ',
			bundleId,
			' reference:file://',
			dir
		].join('');
		return gogoShell
		.connect({ port: configs.gogoPort })
		.then(() => gogoShell.sendCommand(command))
		.then((data) => gogoShell.end());
	}
}