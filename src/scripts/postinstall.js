var fs = require('fs');
const chalk = require('chalk');
const prompter = require('cli-prompter');
const path = require('path');
const SEP = path.sep;
var predefinedScriptsModule = require('./predefined-scripts');
var predefinedDepsModule = require('./predefined-dev-deps');
const defaultDemoPath = path.join("..", "demo");
const defaultDemoAngularPath = path.join("..", "demo-angular");
const defaultDemoVuePath = path.join("..", "demo-vue");

const inputIsConfiguredKey = "isConfigured";
const inputPluginFolderKeyKey = "inputPluginFolderKey";
const inputPluginSrcFolderKey = "pluginSrcFolder";
const inputPluginPlatformFolderKey = "pluginPlatformFolder";
const inputPluginIosSrcFolderKey = "pluginIosSrcFolder";
const inputPluginAndroidSrcFolderKey = "pluginAndroidSrcFolder";
const inputAndroidLibraryNameKey = "androidLibraryName";
const inputIOSLibraryNameKey = "iosLibraryName";
const inputDemoFolderKey = "demoFolder";
const inputDemoAngularFolderKey = "demoAngularFolder";
const inputDemoVueFolderKey = "demoVueFolder";
const inputProvisioningProfileKey = "provisioningProfile";
const configurationFilePath = getConfigFilePath();
const emptyProvisioningProfileValue = "none";
const pluginSrcFolderQuestion = {
    type: 'text',
    name: inputPluginSrcFolderKey,
    message: "What is the path to your plugin's TS/JS source code ?"
};
const inputPluginPlatformFolderQuestion = {
    type: 'text',
    name: inputPluginPlatformFolderKey,
    message: "What is the path to your plugin's platforms directory?"
};
const inputPluginIosSrcFolderQuestion = {
    type: 'text',
    name: inputPluginIosSrcFolderKey,
    message: "What is the path to your plugin's native iOS source code ?"
};
const inputIOSLibraryNameQuestion = {
    type: 'text',
    name: inputIOSLibraryNameKey,
    message: "What is the name (no spaces) of the native iOS library (.framework file) of your Xcode proj ?"
};
const inputPluginAndroidSrcFolderQuestion = {
    type: 'text',
    name: inputPluginAndroidSrcFolderKey,
    message: "What is the path to your plugin's native Android source code ?"
};
const inputAndroidLibraryNameQuestion = {
    type: 'text',
    name: inputAndroidLibraryNameKey,
    message: "What is the name (no spaces) of the native Android library (.arr file) of your Android Studio proj ?"
};
const inputDemoFolderQuestion = {
    type: 'text',
    name: inputDemoFolderKey,
    message: "Where is the NS application you want to use ?"
};
const inputDemoAngularFolderQuestion = {
    type: 'text',
    name: inputDemoAngularFolderKey,
    message: "Where is the NS + Angular application you want to use ?",
    default: "<not configured>"
};
const inputDemoVueFolderQuestion = {
    type: 'text',
    name: inputDemoVueFolderKey,
    message: "Where is the NS + Vue application you want to use ?",
    default: "<not configured>"
};
const inputProvisioningProfileQuestion = {
    type: 'text',
    name: inputProvisioningProfileKey,
    message: "What is the 'Apple Developer Provisioning profile' that is required for the demo and demo-angular apps ? (press 'enter' if not required)",
    default: emptyProvisioningProfileValue
};

console.log(chalk.blue("'nativescript-dev-debugging': Plugin Configuration started ..."));
console.log(chalk.blue("Note: If you want to configure the plugin from scratch execute: " + chalk.yellow("$ node node_modules/nativescript-dev-debugging/index.js")));

let isJsonValid = true;
let missingValuesQuestions = [];
let configInputs;
if (fs.existsSync(configurationFilePath)) {
    console.log(chalk.green("Configuring from local 'n.debug.config.json'"));
    const configFile = fs.readFileSync(configurationFilePath);
    try {
        var configJsonObject = JSON.parse(configFile);
        var inputParams = {
            pluginAndroidSrcFolder: undefined,
            pluginIosSrcFolder: undefined,
            pluginSrcFolder: undefined,
            pluginPlatformFolder: undefined,
            androidLibraryName: undefined,
            iosLibraryName: undefined,
            demoFolder: undefined,
            demoAngularFolder: undefined,
            demoVueFolder: undefined,
            provisioningProfile: undefined
        };
        inputParams.pluginSrcFolder = setReadJsonValue(configJsonObject[inputPluginSrcFolderKey], pluginSrcFolderQuestion);
        inputParams.pluginPlatformFolder = setReadJsonValue(configJsonObject[inputPluginPlatformFolderKey], inputPluginPlatformFolderQuestion);
        inputParams.pluginIosSrcFolder = setReadJsonValue(configJsonObject[inputPluginIosSrcFolderKey], inputPluginIosSrcFolderQuestion);
        inputParams.iosLibraryName = setReadJsonValue(configJsonObject[inputIOSLibraryNameKey], inputIOSLibraryNameQuestion);
        inputParams.pluginAndroidSrcFolder = setReadJsonValue(configJsonObject[inputPluginAndroidSrcFolderKey], inputPluginAndroidSrcFolderQuestion);
        inputParams.androidLibraryName = setReadJsonValue(configJsonObject[inputAndroidLibraryNameKey], inputAndroidLibraryNameQuestion);
        inputParams.demoFolder = setReadJsonValue(configJsonObject[inputDemoFolderKey], inputDemoFolderQuestion);
        inputParams.demoAngularFolder = setReadJsonValue(configJsonObject[inputDemoAngularFolderKey], inputDemoAngularFolderQuestion);
        inputParams.demoVueFolder = setReadJsonValue(configJsonObject[inputDemoVueFolderKey], inputDemoVueFolderQuestion);
        inputParams.provisioningProfile = setReadJsonValue(configJsonObject[inputProvisioningProfileKey], inputProvisioningProfileQuestion);

        if (isJsonValid) {
            writeToSrcJson(inputParams);
        } else {
            configInputs = inputParams;
            askForMissingJsonValues();
        }
    } catch (e) {
        console.log(chalk.red("Error reading n.debug.config.json: " + e));
        console.log(chalk.red("The " + configurationFilePath + " file is corrupted. Proceeding with post install configuration."));
        initConfig();
    }
} else {
    console.log(chalk.green("No local 'n.debug.config.json' file was found. Proceeding with manual configuration."));
    initConfig();
}

function setReadJsonValue(value, question) {
    if (typeof value === "undefined") {
        isJsonValid = false;
        missingValuesQuestions.push(question);
    }

    return value;
}

function askForMissingJsonValues() {
    console.log(chalk.red("Warring: ") + chalk.yellow(missingValuesQuestions.length + chalk.green(" fields from the expected configuration inside 'n.debug.config.json' are missing. Please enter them bellow:")));
    prompter(missingValuesQuestions, (err, values) => {
        if (err) {
            writeErrorMessage(err);;
        }
        missingValuesQuestions.forEach(element => {
            configInputs[element.name] = values[element.name];
        });

        writeToSrcJson(configInputs);
        saveConfigurationToLocal(configurationFilePath, configInputs);
    });
}

function initConfig() {
    const yes = "Yes";
    const no = "No";
    const suggestions = [yes, no];

    const questions = [
        {
            type: 'autocomplete',
            name: inputIsConfiguredKey,
            message: "Do you want to setup the plugin's configuration?",
            default: yes,
            suggest: suggestYesNoAnswer,
        }];

    prompter(questions, (err, values) => {
        if (err) {
            writeErrorMessage(err);;
        }

        if (values[inputIsConfiguredKey] == yes) {
            configureJson();
        } else {
            writeErrorMessage("Plugin configuration aborted.");
        }
    });

    function suggestYesNoAnswer({ input }, cb) {
        cb(null, suggestions)
    }

    function configureJson() {
        const questions = [
            {
                type: 'autocomplete',
                name: inputIsConfiguredKey,
                message: "Do you want to configure your repository structure manually or use the predefined 'plugin seed' repository structure?",
                default: yes,
                suggest: suggestYesNoAnswer,
            }];

        prompter(questions, (err, values) => {
            if (err) {
                writeErrorMessage(err);;
            }

            if (values[inputIsConfiguredKey] == yes) {
                configureFromInput();
            } else {
                configureFromPluginSeed();
            }
        });

        function configureFromInput() {
            const questions = [
                pluginSrcFolderQuestion,
                inputPluginPlatformFolderQuestion,
                inputPluginIosSrcFolderQuestion,
                inputIOSLibraryNameQuestion,
                inputPluginAndroidSrcFolderQuestion,
                inputAndroidLibraryNameQuestion,
                inputDemoFolderQuestion,
                inputDemoAngularFolderQuestion,
                inputDemoVueFolderQuestion,
                inputProvisioningProfileQuestion];

            prompter(questions, (err, values) => {
                if (err) {
                    writeErrorMessage(err);;
                }

                var inputParams = {
                    pluginAndroidSrcFolder: undefined,
                    pluginIosSrcFolder: undefined,
                    pluginSrcFolder: undefined,
                    pluginPlatformFolder: undefined,
                    androidLibraryName: undefined,
                    iosLibraryName: undefined,
                    demoFolder: undefined,
                    demoAngularFolder: undefined,
                    demoVueFolder: undefined,
                    provisioningProfile: undefined
                };
                inputParams.pluginAndroidSrcFolder = values[inputPluginAndroidSrcFolderKey];
                inputParams.pluginIosSrcFolder = values[inputPluginIosSrcFolderKey];
                inputParams.pluginSrcFolder = values[inputPluginSrcFolderKey];
                inputParams.pluginPlatformFolder = values[inputPluginPlatformFolderKey];
                inputParams.androidLibraryName = values[inputAndroidLibraryNameKey];
                inputParams.iosLibraryName = values[inputIOSLibraryNameKey];
                inputParams.demoFolder = values[inputDemoFolderKey];
                inputParams.demoAngularFolder = values[inputDemoAngularFolderKey];
                inputParams.demoVueFolder = values[inputDemoVueFolderKey];
                inputParams.provisioningProfile = values[inputProvisioningProfileKey];
                saveConfigurationToLocal(configurationFilePath, inputParams);
                writeToSrcJson(inputParams);
            });
        }

        function configureFromPluginSeed() {
            const questions = [
                {
                    type: 'text',
                    name: inputPluginFolderKeyKey,
                    message: "What is the path to your plugin's repository ?"
                },
                {
                    type: 'text',
                    name: inputIOSLibraryNameKey,
                    message: "What is the name (no spaces) of the native iOS library (.framework file) of your Xcode proj ?"
                },
                {
                    type: 'text',
                    name: inputAndroidLibraryNameKey,
                    message: "What is the name (no spaces) of the native Android library (.arr file) of your Android Studio proj ?"
                },
                {
                    type: 'text',
                    name: inputProvisioningProfileKey,
                    message: "What is the 'Apple Developer Provisioning profile' that is required for the demo and demo-angular apps ? (press 'enter' if not required)",
                    default: emptyProvisioningProfileValue
                }];

            prompter(questions, (err, values) => {
                if (err) {
                    writeErrorMessage(err);;
                }

                var inputParams = {
                    pluginAndroidSrcFolder: undefined,
                    pluginIosSrcFolder: undefined,
                    pluginSrcFolder: undefined,
                    pluginPlatformFolder: undefined,
                    androidLibraryName: undefined,
                    iosLibraryName: undefined,
                    demoFolder: undefined,
                    demoAngularFolder: undefined,
                    demoVueFolder: undefined,
                    provisioningProfile: undefined
                };
                var pluginRepositoryPath = trimTrailingChar(values[inputPluginFolderKeyKey], SEP);;
                inputParams.pluginAndroidSrcFolder = path.join(pluginRepositoryPath, "src-native", "android");
                inputParams.pluginIosSrcFolder = path.join(pluginRepositoryPath, "src-native", "ios");
                inputParams.pluginSrcFolder = path.join(pluginRepositoryPath, "src");
                inputParams.pluginPlatformFolder = path.join(pluginRepositoryPath, "src", "platforms");
                inputParams.androidLibraryName = values[inputAndroidLibraryNameKey];
                inputParams.iosLibraryName = values[inputIOSLibraryNameKey];
                inputParams.demoFolder = path.join(pluginRepositoryPath, "demo");
                inputParams.demoAngularFolder = path.join(pluginRepositoryPath, "demo-angular");
                inputParams.demoVueFolder = path.join(pluginRepositoryPath, "demo-vue");
                inputParams.provisioningProfile = values[inputProvisioningProfileKey];
                saveConfigurationToLocal(configurationFilePath, inputParams);
                writeToSrcJson(inputParams);
            });
        }
    }
}

function getConfigFilePath() {
    const arg = process.argv[2];
    let configFileName = "n.debug.config.json";
    if (process.env.INIT_CWD) {
        configFileName = path.join(process.env.INIT_CWD, "n.debug.config.json");
    }

    if (arg && arg != "" && arg != "dev") {
        return arg;
    } else {
        if (arg != "dev") {
            return configFileName;

        } else {
            return path.join(process.cwd(), "app", configFileName);
        }
    }
}

function writeToSrcJson(inputParams) {
    const scriptsTag = "scripts";
    const watchTag = "watch"
    const devDepsTag = "devDependencies";
    const descriptionsTag = "descriptions";
    const shortCommandsTag = "shortCommands";
    const buildCommandsTag = "buildCommand"
    const categoriesTag = "categories";
    var packagePath = path.join(inputParams.pluginSrcFolder, "package.json");
    let jsonFile = fs.readFileSync(packagePath);
    var jsonObject = JSON.parse(jsonFile);
    inputParams = cleanUpInput(inputParams);
    const predefinedScripts = predefinedScriptsModule.getPluginPreDefinedScripts(
        inputParams.pluginSrcFolder,
        inputParams.demoFolder,
        inputParams.demoAngularFolder,
        inputParams.demoVueFolder,
        inputParams.pluginPlatformFolder,
        inputParams.pluginIosSrcFolder,
        inputParams.pluginAndroidSrcFolder,
        inputParams.androidLibraryName,
        inputParams.provisioningProfile,
        inputParams.iosLibraryName,
        inputParams.androidLibraryName);
    var predefinedDevDependencies = predefinedDepsModule.getDevDependencies();
    var jsonScripts = ensureJsonObject(jsonObject[scriptsTag]);
    var jsonDevDeps = ensureJsonObject(jsonObject[devDepsTag]);
    var newScripts = updateScripts(predefinedScripts, jsonScripts);
    var newDevDeps = updateDevDependencies(predefinedDevDependencies, jsonDevDeps);

    jsonObject[scriptsTag] = newScripts;
    jsonObject[devDepsTag] = newDevDeps;
    fs.writeFileSync(packagePath, JSON.stringify(jsonObject, null, "\t"));

    var ndJson = {};
    var pluginScriptsJson = {};
    var pluginDescriptionsJson = {};
    var pluginShortCommandsJson = {};
    var pluginBuildCommandJson = {};
    var pluginCategoriesJson = {};
    var pluginWatchJson = {};
    var pluginScripts = updateScripts(predefinedScripts, pluginScriptsJson);
    var descriptions = updateDescriptions(predefinedScripts, pluginDescriptionsJson);
    var shortCommands = updateShortCommands(predefinedScripts, pluginShortCommandsJson);
    var buildCommand = updateBuildCommands(predefinedScripts, pluginBuildCommandJson);
    var categories = updateCategories(predefinedScripts, pluginCategoriesJson);
    var pluginWatch = updateWatch(predefinedScripts, pluginWatchJson);
    ndJson[scriptsTag] = pluginScripts;
    ndJson[watchTag] = pluginWatch;
    ndJson[descriptionsTag] = descriptions;
    ndJson[shortCommandsTag] = shortCommands;
    ndJson[buildCommandsTag] = buildCommand;
    ndJson[categoriesTag] = categories;
    var ndJsonPath = path.join(inputParams.pluginSrcFolder, "node_modules", "nativescript-dev-debugging", "scripts", "nd-package.json");
    fs.writeFileSync(ndJsonPath, JSON.stringify(ndJson, null, "\t"));

    console.log(chalk.green("Plugin Configuration Successful"));
    console.log(chalk.green("To get started execute:" + chalk.yellow(" $ npm run nd.run")));
    console.log(chalk.green("For full documentation and available commands run") + chalk.yellow(' $ npm run nd.help'));
    // console.log(chalk.green("IMPORTANT: ") + chalk.yellow("make sure to run 'npm install' now to install the newly added dependencies."));
}

function saveConfigurationToLocal(filePath, config) {
    const configInputsArray = {};
    configInputsArray[inputPluginSrcFolderKey] = config.pluginSrcFolder;
    configInputsArray[inputPluginPlatformFolderKey] = config.pluginPlatformFolder;
    configInputsArray[inputPluginIosSrcFolderKey] = config.pluginIosSrcFolder;
    configInputsArray[inputIOSLibraryNameKey] = config.iosLibraryName;
    configInputsArray[inputPluginAndroidSrcFolderKey] = config.pluginAndroidSrcFolder;
    configInputsArray[inputAndroidLibraryNameKey] = config.androidLibraryName;
    configInputsArray[inputDemoFolderKey] = config.demoFolder;
    configInputsArray[inputDemoAngularFolderKey] = config.demoAngularFolder;
    configInputsArray[inputDemoVueFolderKey] = config.demoVueFolder;

    if (config.provisioningProfile != emptyProvisioningProfileValue) {
        configInputsArray[inputProvisioningProfileKey] = config.provisioningProfile
    }
    fs.writeFileSync(filePath, JSON.stringify(configInputsArray, null, "\t"));
}

function ensureJsonObject(jsonSection) {
    if (!jsonSection) {
        return {};
    }

    return jsonSection;
}

function cleanUpInput(input) {
    if (input.demoFolder != defaultDemoPath) {
        input.demoFolder = trimTrailingChar(input.demoFolder, SEP);
    }

    if (input.demoAngularFolder && input.demoAngularFolder != defaultDemoAngularPath) {
        input.demoAngularFolder = trimTrailingChar(input.demoAngularFolder, SEP);
    }

    if (input.demoVueFolder && input.demoVueFolder != defaultDemoVuePath) {
        input.demoVueFolder = trimTrailingChar(input.demoVueFolder, SEP);
    }
    input.pluginPlatformFolder = trimTrailingChar(input.pluginPlatformFolder, SEP);
    input.pluginIosSrcFolder = trimTrailingChar(input.pluginIosSrcFolder, SEP);
    input.pluginAndroidSrcFolder = trimTrailingChar(input.pluginAndroidSrcFolder, SEP);

    return input;
}

function trimTrailingChar(input, charToTrim) {
    var regExp = new RegExp(charToTrim + "+$");
    var result = input.replace(regExp, "");
    result = addPrefixChar(result, SEP);

    return result;
}

function addPrefixChar(input, char) {
    // if the path starts with a separator or is of the type "c:...", ignore it
    if (!input.startsWith(char) && !/^[a-z]+:/i.test(input)) {
        return char + input;
    }

    return input;
}

function updateScripts(newScripts, jsonScripts) {
    newScripts.forEach((script) => {
        jsonScripts[script.key] = script.value;
    });

    return jsonScripts;
}

function updateDevDependencies(newDevDependencies, jsonDevDeps) {
    newDevDependencies.forEach((dep) => {
        jsonDevDeps[dep.key] = dep.value;
    });

    return jsonDevDeps;
}

function updateWatch(newWatch, jsonWatch) {
    newWatch.forEach((watch) => {
        if (watch.patterns && watch.extensions) {
            var value = { patterns: watch.patterns, extensions: watch.extensions };
            if (watch.ignore) {
                value["ignore"] = watch.ignore;
            }
    
            if (watch.delay) {
                value["delay"] = watch.delay;
            }
    
            jsonWatch[watch.key] = value;
        }
    });

    return jsonWatch;
}

function updateDescriptions(newDevDependencies, jsonDevDeps) {
    newDevDependencies.forEach((dep) => {
        jsonDevDeps[dep.key] = dep.description;
    });

    return jsonDevDeps;
}

function updateShortCommands(scripts, jsonDevDeps) {
    scripts.forEach((script) => {
        jsonDevDeps[script.key] = script.shortCommands;
    });

    return jsonDevDeps;
}

function updateBuildCommands(scripts, jsonDevDeps) {
    scripts.forEach((script) => {
        jsonDevDeps[script.key] = script.buildCommand;
    });

    return jsonDevDeps;
}

function updateCategories(newDevDependencies, json) {
    newDevDependencies.forEach((dep) => {
        json[dep.key] = dep.category;
    });

    return json;
}

function writeErrorMessage(message) {
    console.log(chalk.red(message));
    console.log(chalk.blue("In order to configure the 'nativescript-dev-debugging' plugin run:") + chalk.yellow(" $ node node_modules/nativescript-dev-debugging/index.js"));
}