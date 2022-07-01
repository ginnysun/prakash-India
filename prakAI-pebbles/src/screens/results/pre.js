console.log("begin results/pre.js");

var timestamp = Date.now();
saveDataLog();

function saveDataLog() {
	const { getCurrentWindow, app, dialog } = require('electron').remote;
	const path = require('path');
	const fs = require('fs');

	let mainWindow = getCurrentWindow();

	// save backup data
	dataLog = sessionStorage.getItem("dataLog");
	experimentalDataDir = sessionStorage.getItem("experimentalDataDir");
	backupPathName = path.join(experimentalDataDir, timestamp + '_backup');
	fs.writeFileSync(backupPathName + '.json', JSON.stringify(dataLog), 'utf-8');
	fs.writeFileSync(backupPathName + '.csv', jsonToCSV(dataLog));
}

function returnToConfig() {

	const { getCurrentWindow, app, dialog } = require('electron').remote;
	const path = require('path');
	const fs = require('fs');

	let mainWindow = getCurrentWindow();

	experimentalDataDir = sessionStorage.getItem("experimentalDataDir");
	//save data
	saveOptions = {
		title: "Save Data Log",
		defaultPath : path.join(experimentalDataDir, timestamp + '.json'),
		buttonLabel : "Save",

		filters :[
		  {name: 'json', extensions: ['json']}
		]
	 };

	dataLog = sessionStorage.getItem("dataLog");

	// save in user location
	userInput = dialog.showSaveDialogSync(mainWindow, saveOptions);
	console.log(userInput);
	if (userInput !== undefined) {
		console.log(userInput);
		fs.writeFileSync(userInput, JSON.stringify(dataLog), 'utf-8');
		fs.writeFileSync(userInput.slice(0,-5) + '.csv', jsonToCSV(dataLog));
		mainWindow.setMenuBarVisibility(true);
		mainWindow.setFullScreen(false);
		let content = path.join(app.getAppPath(), 'src', 'screens', 'config', 'index.html');
		mainWindow.loadFile(content);
	} else {
		messageOptions = {
			message: 'You did not save the data, are you sure you want to proceed?',
			buttons: ['discard data', 'go back and save data'],
			defaultId: 1
		};
		userInput = dialog.showMessageBoxSync(mainWindow, messageOptions);
		if (userInput == 0) {
			sessionStorage.setItem("dataLog", '');
			mainWindow.setMenuBarVisibility(true);
			mainWindow.setFullScreen(false);
			let content = path.join(app.getAppPath(), 'src', 'screens', 'config', 'index.html');
			mainWindow.loadFile(content);
		}
	}

}

function jsonToCSV(dataLog) {
	var array = typeof dataLog != 'object' ? JSON.parse(dataLog) : dataLog;
	var csv = '';
	var header = 'Event, Time Stamp, Trial Number, Main Image Position, Selected Image Position, Result,';
	csv += header + '\r\n';
	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			line += array[i][index] + ',';
		}
		csv += line + '\r\n';
	}
	return csv;
}