'use strict';

const fs = require('fs');
const path = require('path');
const readline  = require('readline');

class Bnd {
	static getJarName(dir) {
		return Bnd.getSymbolicName(dir).then(symbolicName => symbolicName + '.jar');
	}

	static getSymbolicName(dir) {
		return new Promise((resolve, reject) => {
			const bnd = path.join(dir, 'bnd.bnd');
			try {
				const reader = readline.createInterface({
					input: fs.createReadStream(bnd)
				});

				var foundName = false;

				reader.on('line', function(line) {
					if (line.indexOf('Bundle-SymbolicName') === 0) {
						const parts = line.split(':');

						foundName = true;

						resolve(parts[1].trim());
					}
				});

				reader.on('close', function() {
					if (!foundName) {
						resolve(path.basename(process.cwd()));
					}
				});
			}
			catch (e) {
				reject(Error('Could not open bnd file.'));
			}
		});
	}
}

module.exports = Bnd;