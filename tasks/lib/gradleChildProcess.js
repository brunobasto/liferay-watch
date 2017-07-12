const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = (args) => {
	const cwd = process.cwd();

	const gradleSettingsFilePath = path.join(cwd, '..', 'settings.gradle');

	if (fs.existsSync(gradleSettingsFilePath)) {
		const gradleSettingsTempFilePath = gradleSettingsFilePath + '.tmp';

		fs.renameSync(gradleSettingsFilePath, gradleSettingsTempFilePath);

		const cp = childProcess.spawn('gradle', args, { cwd });

		cp.on('exit', () => fs.renameSync(gradleSettingsTempFilePath, gradleSettingsFilePath));

		return cp;
	}
	else {
		return childProcess.spawn('gradle', args, { cwd });
	}
}