console.log("begin results/post.js");
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const path = require('path');

// pulls results and displays them
resultsDiv = document.getElementById('results');
dataLog = JSON.parse(sessionStorage.getItem("dataLog"));
myConsole.log(dataLog);
listItems = [];
dataLog.forEach((log, index) => {
	listItems[index] = '<li>' + JSON.stringify(log) + '</li>'
});
resultsDiv.innerHTML = listItems.join("");


