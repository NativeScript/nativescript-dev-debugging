const fs = require('fs');
const chalk = require('chalk');
const prompter = require('cli-prompter');
const log = console.log;
var jsonHelper = require('./json-tags-helper');
let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject = JSON.parse(jsonFile);
const inputCategoryKey = "category";

var categories = jsonHelper.getCategoriesDictionary(jsonObject);
var tempArray = ["all"];
categories.forEach(category => {
    var words = category.value.split(" ");
    words.forEach(word => {
        tempArray.push(word);
    });
});
var uniqueCategories = tempArray.filter(onlyUniqueComparer);
uniqueCategories.sort();
uniqueCategories = uniqueCategories.reduce((acc, element) => {
    if (element === "main") {
        return [element, ...acc];
    } else {
        if (element === "developNative") {
            return [element, ...acc];
        }

        if (element === "debugNative") {
            return [element, ...acc];
        }
    }
    return [...acc, element];
}, []);

console.log(uniqueCategories.length);

const questions = [
    {
        type: 'autocomplete',
        name: inputCategoryKey,
        default: "main",
        message: "What type of commands do you need help with ?",
        suggest: suggestHelpCategories,
    }];

prompter(questions, (err, values) => {
    if (err) {
        writeErrorMessage(err);;
    }

    var inputParams = {
        category: undefined
    };
    inputParams.category = values[inputCategoryKey];
    writeCommandsToConsole(jsonHelper.getDescriptionsDictionary(jsonObject), inputParams.category);
})


function suggestHelpCategories({ input }, cb) {
    const suggestions = uniqueCategories;
    cb(null, suggestions)
}

function writeCommandsToConsole(scriptsDict, category) {
    log(chalk.blue("Available Commands for: ") + chalk.yellow(category));
    log("\n");
    log(chalk.green("NPM command") + " : " + chalk.yellow("Description\n"));
    for (i = 0; i < scriptsDict.length; i++) {
        var scriptPair = scriptsDict[i];
        var command = scriptPair.key;
        var description = scriptPair.value;
        if (!category) {
            log(chalk.green(command) + " : " + chalk.yellow(description));
        } else {
            if (categories[i].value.includes(category) || category == "all") {
                log(chalk.green(command) + " : " + chalk.yellow(description));
            }
        }
    }
}

function onlyUniqueComparer(value, index, self) {
    return self.indexOf(value) === index;
}