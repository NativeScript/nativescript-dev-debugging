const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
var jsonHelper = require('./json-tags-helper');
let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject = JSON.parse(jsonFile);
writeCommandsToConsole(jsonHelper.getDescriptionsDictionary(jsonObject));

function writeCommandsToConsole(scriptsDict) {
    log(chalk.blue("Available Commands: \n \n"));
    scriptsDict.forEach(scriptPair => {
        var command = scriptPair.key;
        var description = scriptPair.value;
        log(chalk.green(command) + " : " + chalk.yellow(description));
    });

}

module.exports.getHelpContent = writeCommandsToConsole;