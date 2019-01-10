
const chalk = require('chalk');
const fs = require('fs');
const jsonHelper = require('./json-tags-helper');
const prompter = require('cli-prompter');

let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject = JSON.parse(jsonFile);
const shortCommands = jsonHelper.getShortCommandsDictionary(jsonObject);

const inputDemoKey = "demo";
const inputPlatformKey = "platform";
const inputDeviceKey = "device";
const inputActionKey = "action";

const appTypes = ["demo", "demo-angular"];
const platformTypes = ["ios", "android"];
const targetTypes = ["simulator", "device"];
const actionTypes = ["attach", "watch"];

initPrompter();

function getShortCommandPair(key) {
    return shortCommands.find(function (element) {
        var found;
        for (var i = 0; i < element.value.length; i++) {
            found = element.value[i] == key;
            if (found) {
                break;
            }
        }

        return found;
    });
}

function initPrompter() {
    const questions = [
        {
            type: 'autocomplete',
            name: inputDemoKey,
            message: "Which demo app would you like to run ?",
            suggest: getAppTypes
        },
        {
            type: 'autocomplete',
            name: inputPlatformKey,
            message: "On which platform do you want to run it ?",
            suggest: getPlatformTypes
        },
        {
            type: 'autocomplete',
            name: inputDeviceKey,
            message: "On what device do you want to run it ?",
            suggest: getTargetTypes
        },
        {
            type: 'autocomplete',
            name: inputActionKey,
            message: "What type workflow do you want to start ?",
            suggest: getActionTypes
        }];

    prompter(questions, (err, values) => {
        if (err) {
            writeErrorMessage(err);;
        }

        var inputParams = {
            inputDemo: undefined,
            inputPlatform: undefined,
            inputDevice: undefined,
            inputAction: undefined
        };
        inputParams.inputDemo = values[inputDemoKey];
        inputParams.inputPlatform = values[inputPlatformKey];
        inputParams.inputDevice = values[inputDeviceKey];
        inputParams.inputAction = values[inputActionKey];

        const command = parseInput(inputParams);
        execute(command);
    });
}

function getAppTypes({ input }, cb) {
    cb(null, appTypes)
}

function getPlatformTypes({ input }, cb) {
    cb(null, platformTypes)
}

function getTargetTypes({ input }, cb) {
    cb(null, targetTypes)
}

function getActionTypes({ input }, cb) {
    cb(null, actionTypes)
}

function parseInput(inputParams) {
    const inputCommand = inputParams.inputDemo + " " + inputParams.inputPlatform + " " + inputParams.inputDevice + " " + inputParams.inputAction;
    console.log(inputCommand);
    var ndBuildReleasePair = getShortCommandPair(inputCommand);
    return "npm run " + ndBuildReleasePair.key;
}

function execute(command) {
    console.log(chalk.blue("'nativescript-dev-debugging': Starting: ") + chalk.yellow(command));
    const spawn = require('child_process').spawn;
    spawn(command, [], { stdio: 'inherit', shell: true });
}