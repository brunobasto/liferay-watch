'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var getGradleExecutable = function(dir) {
	var gradlew = path.join(dir, 'gradlew');

	try {
		fs.lstatSync(gradlew);

		return gradlew;
	}
	catch(e) {
	}

	return false;
};

module.exports = {
	run: function(task, done) {
		var dir = path.resolve(process.cwd());

		var gradlew;

		while (true) {
			gradlew = getGradleExecutable(dir);

			if (dir === '/' || gradlew) {
				break;
			}

			var arr = dir.split(path.sep);
			arr.pop();

			dir = arr.length === 1 ? '/' : arr.join(path.sep);
		};

		if (gradlew) {
			console.log('Found gradle', gradlew);

			var proc = spawn(gradlew, [task], {
				detached: true
			});

			proc.stderr.on('data', function(buf) {
				console.log('%s', String(buf));
			});

			proc.stdout.on('data', function(buf) {
				console.log('%s', String(buf));
			});

			proc.on('exit', function() {
				if (done) {
					done();
				}
			});
		}
		else {
			throw new Error('Could not find gradlew on the directory tree.');
		}
	}
};