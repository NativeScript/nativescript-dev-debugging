const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
var jsonHelper = require('./json-tags-helper');
let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject = JSON.parse(jsonFile);
const helpCategory = process.argv[2];
writeCommandsToConsole(jsonHelper.getDescriptionsDictionary(jsonObject));

function writeCommandsToConsole(scriptsDict) {
    var categories = jsonHelper.getCategoriesDictionary(jsonObject);
    if (!helpCategory) {
        var tempArray = [];
        categories.forEach(category => {
            tempArray.push(category.value);
        });
        var uniqueCategories = tempArray.filter(onlyUniqueComparer);
        log(chalk.blue("You can use params after 'npm run nd.help <param>' to sort commands by their main functionality. Available params: ") + " all, " + uniqueCategories.join(", "));
        log(chalk.blue("Example: 'npm run nd.help run'"));
    } else {
        log(chalk.blue("Available Commands:\n \n"));
        log(chalk.green("NPM command") + " : " + chalk.yellow("Description\n"));
        for (i = 0; i < scriptsDict.length; i++) {
            var scriptPair = scriptsDict[i];
            var command = scriptPair.key;
            var description = scriptPair.value;
            if (!helpCategory) {
                log(chalk.green(command) + " : " + chalk.yellow(description));
            } else {
                if (helpCategory == categories[i].value || helpCategory == "all") {
                    log(chalk.green(command) + " : " + chalk.yellow(description));
                }
            }
        }
    }
}

function onlyUniqueComparer(value, index, self) {
    return self.indexOf(value) === index;
}

module.exports.getHelpContent = writeCommandsToConsole;