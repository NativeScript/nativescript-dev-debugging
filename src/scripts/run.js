
const chalk = require('chalk');
const fs = require('fs');
const jsonHelper = require('./json-tags-helper');
const logger = require('./helpers/logger');
const prompter = require('cli-prompter');
const chokidar = require('chokidar');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const psTree = require('ps-tree');
const _ = require('lodash');

let jsonFile = fs.readFileSync(__dirname + "/nd-package.json");
var jsonObject = JSON.parse(jsonFile);
const shortCommands = jsonHelper.getShortCommandsDictionary(jsonObject);
const watchers = jsonHelper.getWatchersDictionary(jsonObject);

const inputDemoKey = "demo";
const inputPlatformKey = "platform";
const inputDeviceKey = "device";
const inputActionKey = "action";

const appTypes = ["demo", "demo-angular", "demo-vue"];
const platformTypes = ["ios", "android"];
const targetTypes = ["simulator", "device"];
const actionTypes = ["attach", "attach & watch"];
logger.setIsEnabled(process.argv[2] == "log" ? true : false);

let shouldStartNew = false;
let runChildProcess;
let processKilled = false;
let startingProcess = false;
let processTimeout;
let watcherTimeout;

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

function getWatcherPair(key) {
    return watchers.find(function (element) {
        var found;
        found = element.key == key;
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
        const watcher = getWatcherDetails(inputParams);
        execute(command, watcher);
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
    logger.logObject("parse input:", inputParams);
    const inputCommand = formatInput(inputParams);
    var ndCommandPair = getShortCommandPair(inputCommand);

    return "npm run " + ndCommandPair.key;
}

function formatInput(params) {
    return params.inputDemo + " " + params.inputPlatform + " " + params.inputDevice + " " + params.inputAction;
}

function getWatcherDetails(inputParams) {
    logger.logObject("get watcher details for:", inputParams);
    const inputCommand = formatInput(inputParams);
    var ndCommandPair = getShortCommandPair(inputCommand);
    var watcherPair = getWatcherPair(ndCommandPair.key);
    if (watcherPair) {
        return watcherPair.value;
    }

    logger.logObject("No watcher details found for:", inputParams);


    return undefined;
}

let acceptedFileExtensions = [];

function buildWildcardList(path) {
    let result = [];
    _.each(acceptedFileExtensions, (extension) => {
        result.push(path + '**/*.' + extension);
    });

    return result.length > 0 ? result : undefined;
}

function execute(command, watcher) {
    console.log(chalk.blue("'nativescript-dev-debugging': Starting: ") + chalk.yellow(command));
    startingProcess = true;
    startProcess(command);
    startingProcess = false;

    if (watcher && watcher.patterns) {
        // Glob to ignore .dotfiles
        let ignored = "/(^|[\/\\])\../";

        // TODO: Not working, watcher is triggering for all files
        // if (watcher.extensions) {
        //     let extensionsArray = [];
        //     watcher.extensions.forEach(element => {
        //         extensionsArray.push(element);
        //     });
        //     acceptedFileExtensions = extensionsArray;
        // }

        let pattersWithExtensions = buildWildcardList(watcher.patterns);
        let wildcardList = pattersWithExtensions ? pattersWithExtensions : watcher.patterns;
        logger.logObject("Starting file watch on:", wildcardList);

        // Currently cannot used paths to be ignored due to issue in chokidar https://github.com/paulmillr/chokidar/issues/773
        // if (watcher.ignore) {
        //     ignored = watcher.ignore;
        // }

        chokidar.watch(wildcardList, { ignored: ignored }).on('raw', (event, path, details) => {
            logger.logMessage("File change detected:");
            logger.logObject("Raw event info: ", event, path, details);
            if (event !== "unknown") {
                if (watcherTimeout) {
                    clearTimeout(watcherTimeout);
                }

                watcherTimeout = setTimeout(() => {
                    if (!processKilled) {
                        shouldStartNew = true;
    
                        killChildProcess();
                    }
                }, 2000);
            }
        });
    }
}

function startProcess(command) {
    if (startingProcess) {
        logger.logMessage("Starting child process")
        runChildProcess = spawn(command, [], { stdio: 'inherit', shell: true, detached: true });
        processKilled = false;
        runChildProcess.on("close", function (code, signal) {
            logger.logMessage("'nd.run' child process 'close' with code: " + code + " and signal " + signal);
            if (shouldStartNew) {
                shouldStartNew = false;
                if (processTimeout) {
                    clearTimeout(processTimeout);
                }

                processTimeout = setTimeout(() => {
                    startingProcess = true;
                    startProcess(command);
                    startingProcess = false;
                }, 1500);
            }

            processKilled = true;
        });
    }
}

function killChildProcess() {
    logger.logMessage("Kill child process " + runChildProcess.pid);

    // Starts new child_process by closing the previous one
    killProcessTree(runChildProcess.pid);
    process.kill(-runChildProcess.pid);
}

function killProcessTree(pid) {
    psTree(pid, (error, children) => {
        if (error) {
            logger.logErrorObject(error);
        }
        const processChildren = _.map(children, "PID");
        const killCmd = `kill -9 ${processChildren.join(" ")}`;

        logger.logObject("Kill all child processes:", killCmd);
        execAsUser(killCmd);
    });
}

function execAsUser(cmd) {
    exec(cmd);
}

process.on('SIGINT', function () {
    logger.logMessage("Stopping 'nativescript-dev-debugging")
    if (!processKilled) {
        killChildProcess();
    }

    process.exit();
});