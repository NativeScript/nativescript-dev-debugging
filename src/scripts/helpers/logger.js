const chalk = require('chalk');
var isEnabled = false;

function logMessage(message) {
    if (isEnabled) {
        console.log(chalk.greenBright(message));
    }
}

function logError(message) {
    if (isEnabled) {
        console.log("Error: " + chalk.red(message));
    }
}

function logObject(message, ...objects) {
    if (isEnabled) {
        console.log(chalk.greenBright(message));
        for (let i = 0; i < objects.length; i++) {
            console.log(objects[i]);
        }
    }
}

function logErrorObject(message, ...objects) {
    if (isEnabled) {
        console.log(chalk.red(message));
        for (let i = 0; i < objects.length; i++) {
            console.log(objects[i]);
        }
    }
}

function setIsEnabled(value) {
    isEnabled = value;
}

exports.logMessage = logMessage;
exports.logError = logError;
exports.logObject = logObject;
exports.logErrorObject = logErrorObject;
exports.setIsEnabled = setIsEnabled;