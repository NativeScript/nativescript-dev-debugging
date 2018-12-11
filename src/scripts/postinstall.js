var fs = require('fs');
var prompt = require('prompt');
const chalk = require('chalk');
const prompter = require('cli-prompter');
var predefinedScriptsModule = require('./predefined-scripts');
var predefinedWatchersModule = require('./predefied-watchers');
var predefinedDepsModule = require('./predefined-dev-deps');
const defaultDemoPath = "../demo";
const defaultDemoAngularPath = "../demo-angular";

const inputIsConfiguredKey = "isConfigured";
const inputInputPluginFolderKeyKey = "inputPluginFolderKey";
const inputPluginSrcFolderKey = "pluginSrcFolder";
const inputPluginIosSrcFolderKey = "pluginIosSrcFolder";
const inputPluginAndroidSrcFolderKey = "pluginAndroidSrcFolder";
const inputAndroidLibraryNameKey = "androidLibraryName";
const inputIOSLibraryNameKey = "iosLibraryName";
const inputDemoFolderKey = "demoFolder";
const inputDemoAngularFolderKey = "demoAngularFolder";
const inputProvisioningProfileKey = "provisioningProfile";

console.log(chalk.blue("'nativescript-dev-debugging': Plugin Configuration started ..."));
console.log(chalk.blue("Notes: If you want to configure the plugin from scratch execute: $ node node_modules/nativescript-dev-debugging/index.js"));

if (!isLocalTesting()) {
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
                {
                    type: 'text',
                    name: inputPluginSrcFolderKey,
                    message: "What is the path to your plugin's TS/JS source code ?"
                },
                {
                    type: 'text',
                    name: inputPluginIosSrcFolderKey,
                    message: "What is the path to your plugin's native iOS source code ?"
                },
                {
                    type: 'text',
                    name: inputIOSLibraryNameKey,
                    message: "What is the name (no spaces) of the native iOS library (.framework file) of your Xcode proj ?"
                },
                {
                    type: 'text',
                    name: inputPluginAndroidSrcFolderKey,
                    message: "What is the path to your plugin's native Android source code ?"
                },
                {
                    type: 'text',
                    name: inputAndroidLibraryNameKey,
                    message: "What is the name (no spaces) of the native Android library (.arr file) of your Android Studio proj ?"
                },
                {
                    type: 'text',
                    name: inputDemoFolderKey,
                    message: "Where is the NS application you want to use ?",
                    default: "<not configured>"
                },
                {
                    type: 'text',
                    name: inputDemoAngularFolderKey,
                    message: "Where is the NS + Angular application you want to use ?",
                    default: "<not configured>"
                },
                {
                    type: 'text',
                    name: inputProvisioningProfileKey,
                    message: "What is the 'Apple Developer Provisioning profile' that is required for the demo and demo-angular apps ? (press 'enter' if not required)",
                    default: "none"
                }];

            prompter(questions, (err, values) => {
                if (err) {
                    writeErrorMessage(err);;
                }

                var inputParams = {
                    pluginPlatformFolder: undefined,
                    pluginIosSrcFolder: undefined,
                    pluginAndroidSrcFolder: undefined,
                    scripts_dir: undefined,
                    provisioningProfile: undefined
                };
                inputParams.pluginAndroidSrcFolder = values[inputPluginAndroidSrcFolderKey];
                inputParams.pluginIosSrcFolder = values[inputPluginIosSrcFolderKey];
                inputParams.pluginSrcFolder = values[inputPluginSrcFolderKey];
                inputParams.pluginPlatformFolder = inputParams.pluginSrcFolder + "/platforms";
                inputParams.androidLibraryName = values[inputAndroidLibraryNameKey];
                inputParams.iosLibraryName = values[inputIOSLibraryNameKey];
                inputParams.demoFolder = values[inputDemoFolderKey];
                inputParams.demoAngularFolder = values[inputDemoAngularFolderKey];
                inputParams.provisioningProfile = values[inputProvisioningProfileKey];
                writeToSrcJson(inputParams);
            });
        }

        function configureFromPluginSeed() {
            const questions = [
                {
                    type: 'text',
                    name: inputInputPluginFolderKeyKey,
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
                    default: "none"
                }];

            prompter(questions, (err, values) => {
                if (err) {
                    writeErrorMessage(err);;
                }

                var inputParams = {
                    pluginPlatformFolder: undefined,
                    pluginIosSrcFolder: undefined,
                    pluginAndroidSrcFolder: undefined,
                    scripts_dir: undefined,
                    provisioningProfile: undefined
                };
                var pluginRepositoryPath = trimTrailingChar(values[inputInputPluginFolderKeyKey], '/');;
                inputParams.pluginAndroidSrcFolder = pluginRepositoryPath + "/src-native/android";
                inputParams.pluginIosSrcFolder = pluginRepositoryPath + "/src-native/ios";
                inputParams.pluginSrcFolder = pluginRepositoryPath + "/src";
                inputParams.pluginPlatformFolder = pluginRepositoryPath + "/src/platforms";
                inputParams.androidLibraryName = values[inputAndroidLibraryNameKey];
                inputParams.iosLibraryName = values[inputIOSLibraryNameKey];
                inputParams.demoFolder = pluginRepositoryPath + "/demo";
                inputParams.demoAngularFolder = pluginRepositoryPath + "/demo-angular";
                inputParams.provisioningProfile = values[inputProvisioningProfileKey];
                writeToSrcJson(inputParams);
            });
        }
    }
} else {
    // Expected input from user. This is for local development purpose and is coupled with the nativescript-ui-listview plugin's source code
    var values = {};
    values[inputPluginAndroidSrcFolderKey] = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/android";
    values[inputPluginIosSrcFolderKey] = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/ios";
    values[inputPluginSrcFolderKey] = "/Users/amiorkov/Desktop/Work/nativescript-dev-debugging/app";
    values.pluginPlatformFolder = values[inputPluginSrcFolderKey] + "/platforms";
    values[inputAndroidLibraryNameKey] = "TNSListView";
    values[inputIOSLibraryNameKey] = "TNSListView";
    values[inputDemoFolderKey] = defaultDemoPath;
    values[inputDemoAngularFolderKey] = defaultDemoAngularPath;
    values[inputProvisioningProfileKey] = "NativeScriptDevProfile";
    writeToSrcJson(values);
}

function isLocalTesting() {
    return process.argv[2] == "dev";
}

function writeToSrcJson(inputParams) {
    const scriptsTag = "scripts";
    const watchTag = "watch"
    const devDepsTag = "devDependencies";
    const descriptionsTag = "descriptions";
    const categoriesTag = "categories";
    var path = inputParams.pluginSrcFolder + "/package.json";
    let jsonFile = fs.readFileSync(path);
    var jsonObject = JSON.parse(jsonFile);
    inputParams = cleanUpInput(inputParams);
    var predefinedScripts = predefinedScriptsModule.getPluginPreDefinedScripts(
        inputParams.demoFolder,
        inputParams.demoAngularFolder,
        inputParams.pluginPlatformFolder,
        inputParams.pluginIosSrcFolder,
        inputParams.pluginAndroidSrcFolder,
        inputParams.androidLibraryName,
        inputParams.provisioningProfile);
    var predefinedWatchers = predefinedWatchersModule.getPluginPreDefinedWatchers(inputParams.demoFolder, inputParams.demoAngularFolder, inputParams.pluginIosSrcFolder, inputParams.pluginAndroidSrcFolder, inputParams.iosLibraryName, inputParams.androidLibraryName);
    var predefinedDevDependencies = predefinedDepsModule.getDevDependencies();

    var jsonScripts = ensureJsonObject(jsonObject[scriptsTag]);
    var jsonWatch = ensureJsonObject(jsonObject[watchTag]);
    var jsonDevDeps = ensureJsonObject(jsonObject[devDepsTag]);
    var newScripts = updateScripts(predefinedScripts, jsonScripts);
    var newWatch = updateWatch(predefinedWatchers, jsonWatch);
    var newDevDeps = updateDevDependencies(predefinedDevDependencies, jsonDevDeps);

    jsonObject[scriptsTag] = newScripts;
    jsonObject[watchTag] = newWatch;
    jsonObject[devDepsTag] = newDevDeps;
    fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));

    var ndJson = {};
    var pluginScriptsJson = {};
    var pluginDescriptionsJson = {};
    var pluginCategoriesJson = {};
    var pluginWatchJson = {};
    var pluginScripts = updateScripts(predefinedScripts, pluginScriptsJson);
    var descriptions = updateDescriptions(predefinedScripts, pluginDescriptionsJson);
    var categories = updateCategories(predefinedScripts, pluginCategoriesJson);
    var pluginWatch = updateWatch(predefinedWatchers, pluginWatchJson);
    ndJson[scriptsTag] = pluginScripts;
    ndJson[watchTag] = pluginWatch;
    ndJson[devDepsTag] = newDevDeps;
    ndJson[descriptionsTag] = descriptions;
    ndJson[categoriesTag] = categories;
    var ndJsonPath = inputParams.pluginSrcFolder + "/node_modules/nativescript-dev-debugging/scripts/nd-package.json";
    fs.writeFileSync(ndJsonPath, JSON.stringify(ndJson, null, "\t"));

    console.log(chalk.blue("'nativescript-dev-debugging': Plugin Configuration Successful"));
    console.log(chalk.blue("'nativescript-dev-debugging': Run") + chalk.yellow(' $ npm run nd.help') + chalk.blue(" to see the available functionality"));
}

function ensureJsonObject(jsonSection) {
    if (!jsonSection) {
        return {};
    }

    return jsonSection;
}

function cleanUpInput(input) {
    if (input.demoFolder != defaultDemoPath) {
        input.demoFolder = trimTrailingChar(input.demoFolder, '/');
    }

    if (input.demoAngularFolder != defaultDemoAngularPath) {
        input.demoAngularFolder = trimTrailingChar(input.demoAngularFolder, '/');
    }

    input.pluginPlatformFolder = trimTrailingChar(input.pluginPlatformFolder, '/');
    input.pluginIosSrcFolder = trimTrailingChar(input.pluginIosSrcFolder, '/');
    input.pluginAndroidSrcFolder = trimTrailingChar(input.pluginAndroidSrcFolder, '/');

    return input;
}

function trimTrailingChar(input, charToTrim) {
    var regExp = new RegExp(charToTrim + "+$");
    var result = input.replace(regExp, "");
    result = addPrefixChar(result, '/');

    return result;
}

function addPrefixChar(input, char) {
    if (!input.startsWith(char)) {
        return "/" + input;
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
        var value = { patterns: watch.patterns, extensions: watch.extensions };
        if (watch.ignore) {
            value = { patterns: value.patterns, extensions: value.extensions, ignore: watch.ignore };
        }
        jsonWatch[watch.key] = value;
    });

    return jsonWatch;
}

function updateDescriptions(newDevDependencies, jsonDevDeps) {
    newDevDependencies.forEach((dep) => {
        jsonDevDeps[dep.key] = dep.description;
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