const fs = require('fs');
const chalk = require('chalk');
const prompter = require('cli-prompter');
const log = console.log;
var jsonHelper = require('./json-tags-helper');
let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject;
try {
    jsonObject = JSON.parse(jsonFile);
} catch (e) {
    console.log(chalk.red("Error reading " + jsonFile + ": " + e));
    console.log(chalk.red("The nativescript-dev-debugging plugin installation is corrupted. Please execute: " + chalk.yellow("$ node node_modules/nativescript-dev-debugging/index.js")));
}
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
            if (categories[i] && categories[i].value.includes(category) || category == "all") {
                log(chalk.green(command) + " : " + chalk.yellow(description));
            }
        }
    }
}

function onlyUniqueComparer(value, index, self) {
    return self.indexOf(value) === index;
}