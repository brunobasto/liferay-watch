'use strict';

var GogoShell = require('gogo-shell');

module.exports = {
	getBundleId: function(symbolicName, done) {
		var gogoShell = new GogoShell();

		var command = 'lb -s ' + symbolicName + ' | grep Active';

		gogoShell
		.connect({
			port: 11311
		})
		.then(function() {
			return gogoShell.sendCommand(command);
		})
		.then(function(data) {
			gogoShell.end();

			var lines = data.split('\n');

			var info = lines.filter(function(line) {
				return line.indexOf(symbolicName) > -1 && line.trim() !== command;
			}).map(function(line) {
				return line.trim();
			});

			if (info.length === 0) {
				throw new Error('Could not find installed bundle.');
			}

			done(info[0].split('|').shift());
		});
	},

	getLiferayHome: function(done) {
		var gogoShell = new GogoShell();

		var command = 'equinox:props';

		gogoShell
		.connect({
			port: 11311
		})
		.then(function() {
			return gogoShell.sendCommand(command);
		})
		.then(function(data) {
			gogoShell.end();

			var lines = data.split('\n');

			var info = lines.filter(function(line) {
				return line.indexOf('liferay.home') > -1;
			}).map(function(line) {
				return line.trim();
			});

			if (info.length === 0) {
				throw new Error('Could not find liferay.home.');
			}

			done(info[0].split('=').pop().trim());
		});
	},

	install: function(bundleId, dir, done) {
		var gogoShell = new GogoShell();

		var command = [
			'update ',
			bundleId,
			' reference:file://',
			dir
		].join('');

		gogoShell
		.connect({
			port: 11311
		})
		.then(function() {
			return gogoShell.sendCommand(command);
		})
		.then(function(data) {
			gogoShell.end();

			done();
		});
	}
}