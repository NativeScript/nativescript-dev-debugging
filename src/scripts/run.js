
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
const buildCommands = jsonHelper.getBuildCommandsDictionary(jsonObject);

const inputDemoKey = "demo";
const inputPlatformKey = "platform";
const inputDeviceKey = "device";
const inputActionKey = "action";

const appTypes = ["demo", "demo-angular", "demo-vue"];
const platformTypes = ["ios", "android"];
const targetTypes = ["simulator", "device"];
const actionTypes = ["attach", "attach & watch"];
logger.setIsEnabled(process.argv[2] == "log" ? true : false);

let shouldStartNewBuildProcess = false;
let initialBuildProcess;
let mainChildProcess;
let buildChildProcess;
let initialBuildProcessKilled = true;
let mainProcessKilled = true;
let buildProcessKilled = true;
let buildProcessStarting = false;
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

function getBuildCommandPair(key) {
    return buildCommands.find(function (element) {
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
        const buildCommand = getBuildCommand(inputParams);
        console.log(chalk.blue("'nativescript-dev-debugging': Starting: ") + chalk.yellow(command));

        executeInitialBuild(command, watcher, buildCommand);
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

function getBuildCommand(inputParams) {
    logger.logObject("get build command for:", inputParams);
    const inputCommand = formatInput(inputParams);
    var ndCommandPair = getShortCommandPair(inputCommand);
    var buildCommandPair = getBuildCommandPair(ndCommandPair.key);
    if (buildCommandPair) {
        return buildCommandPair.value;
    }

    logger.logObject("No build command found for for:", inputParams);

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

function executeInitialBuild(command, watcher, buildCommand) {
    logger.logMessage("Starting 'executeInitialBuild' child process");
    initialBuildProcessKilled = false;
    initialBuildProcess = spawn(buildCommand, [], { stdio: 'inherit', shell: true, detached: true });
    initialBuildProcess.on("close", function (code, signal) {
        logger.logMessage("CHILD PROCESS CLOSED: for 'initialBuildProcess' with code: " + code + " and signal " + signal);
        executeMainCommandWatcher(command, watcher, buildCommand);
        initialBuildProcessKilled = true;
    });
}

function executeMainCommandWatcher(command, watcher, buildCommand) {
    logger.logMessage("CHILD PROCESS STARTED: 'executeMainCommandWatcher'")
    startProcess(command);

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
                    if (!buildProcessKilled) {
                        shouldStartNewBuildProcess = true;
                        killBuildChildProcess();
                    } else {
                        shouldStartNewBuildProcess = false;
                        buildProcessStarting = true;
                        startProcessForWatcher(buildCommand);
                        buildProcessStarting = false;
                    }
                }, 2000);
            }
        });
    }
}

function startProcess(command) {
    mainProcessKilled = false;
    mainChildProcess = spawn(command, [], { stdio: 'inherit', shell: true, detached: true });
    mainChildProcess.on("close", function (code, signal) {
        logger.logMessage("CHILD PROCESS CLOSED: for 'mainChildProcess' with code: " + code + " and signal " + signal);
        mainProcessKilled = true;
    });
}

function startProcessForWatcher(command) {
    if (buildProcessStarting) {
        logger.logMessage("CHILD PROCESS STARTED: for build with script: " + command)
        buildProcessKilled = false;
        buildChildProcess = spawn(command, [], { stdio: 'inherit', shell: true, detached: true });
        buildChildProcess.on("close", function (code, signal) {
            logger.logMessage("CHILD PROCESS CLOSED: for 'buildChildProcess' with code: " + code + " and signal " + signal);
            if (shouldStartNewBuildProcess) {
                shouldStartNew = false;
                if (processTimeout) {
                    clearTimeout(processTimeout);
                }

                processTimeout = setTimeout(() => {
                    shouldStartNewBuildProcess = false;
                    buildProcessStarting = true;
                    startProcessForWatcher(command);
                    buildProcessStarting = false;
                }, 1500);
            }

            buildProcessKilled = true;
        });
    }
}

function killInitialBuildChildProcess() {
    if (!initialBuildProcessKilled && initialBuildProcess) {
        logger.logMessage("Kill initial build child process " + initialBuildProcess.pid);

        killProcessTree(initialBuildProcess.pid);
        process.kill(-initialBuildProcess.pid);
    }
}

function killBuildChildProcess() {
    if (!buildProcessKilled && buildChildProcess) {
        logger.logMessage("Kill build child process " + buildChildProcess.pid);

        killProcessTree(buildChildProcess.pid);
        process.kill(-buildChildProcess.pid);
    }
}

function killMainChildProcess() {
    if (!mainProcessKilled && mainChildProcess) {
        logger.logMessage("Kill main child process " + mainChildProcess.pid);

        // Starts new child_process by closing the previous one
        killProcessTree(mainChildProcess.pid);
        process.kill(-mainChildProcess.pid);
    }
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
    killMainChildProcess();
    killBuildChildProcess();
    killInitialBuildChildProcess();

    process.exit();
});