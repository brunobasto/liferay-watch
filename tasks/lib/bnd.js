'use strict';

var fs = require('fs');
var path = require('path');
var readline  = require('readline');

module.exports = {
	getJarName: function(dir, done) {
		this.getSymbolicName(dir, function(symbolicName) {
			done(symbolicName + '.jar');
		});
	},

	getSymbolicName: function(dir, done) {
		var bnd = path.join(dir, 'bnd.bnd');

		try {
			var reader = readline.createInterface({
				input: fs.createReadStream(bnd)
			});

			reader.on('line', function(line) {
				if (line.indexOf('Bundle-SymbolicName') === 0) {
					var parts = line.split(':');

					done(parts[1].trim());
				}
			});
		}
		catch(e) {
			throw new Error('Could not open bnd file.');
		}
	}
};