var fs = require('fs');
var prompt = require('prompt');
const chalk = require('chalk');
var predefinedScriptsModule = require('./predefined-scripts');
var predefinedDepsModule = require('./predefined-dev-deps');
var nativeIosFolder = undefined;
var nativeAndroidFolder = undefined;
var packageJsonFolder = undefined;
var androidLibraryName = undefined;
var demoFolder = undefined;
var demoAngularFolder = undefined;
const defaultDemoPath = "../demo";
const defaultDemoAngularPath = "../demo-angular";

function isLocalTesting() {
    return process.argv[2] == "dev";
}

if (isLocalTesting()) {
    // Expected input from user. This is for local development purpose and is coupled with the nativescript-ui-listview plugin's source code
    nativeIosFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/ios";
    nativeAndroidFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/android";
    packageJsonFolder = "/Users/amiorkov/Desktop/Work/nativescript-dev-debugging/app";
    androidLibraryName = "TNSListView";
    demoFolder = defaultDemoPath;
    demoAngularFolder = defaultDemoAngularPath;
}

console.log(chalk.blue("'nativescript-dev-debugging': Plugin Configuration started ..."));
console.log(chalk.blue("Notes: If you want to configure the plugin from start run: $ node node_modules/nativescript-dev-debugging/index.js"));

if (!isLocalTesting()) {
    prompt.start();
    prompt.get({
        name: 'already_configured',
        description: "Did you already setup the plugin configuration? (yes/no)"
    }, function (err, result) {
        if (err) {
            return writeErrorMessage(err);
        }

        if (!isAgreeInput(result.already_configured.toLowerCase())) {
            configurePlugin();
        }
    });
} else {
    configurePlugin();
}

function configurePlugin() {
    var inputParams = {
        pluginPlatformFolder: undefined,
        pluginIosSrcFolder: undefined,
        pluginAndroidSrcFolder: undefined,
        scripts_dir: undefined
    };

    inputParams.pluginAndroidSrcFolder = nativeAndroidFolder;
    inputParams.pluginIosSrcFolder = nativeIosFolder;
    inputParams.pluginPlatformFolder = packageJsonFolder + "/platforms";
    inputParams.pluginSrcFolder = packageJsonFolder;
    inputParams.androidLibraryName = androidLibraryName;
    inputParams.demoFolder = demoFolder;
    inputParams.demoAngularFolder = demoAngularFolder;

    if (!isLocalTesting()) {
        askSrcFolder();
    } else {
        writeToSrcJson();
    }

    function askSrcFolder() {
        if (inputParams.pluginSrcFolder == undefined) {
            prompt.get({
                name: 'pluginSrcFolder',
                description: "What the path to your plugin's TS/JS source code ?"
            }, function (err, result) {
                if (err) {

                    return writeErrorMessage(err);
                }
                if (!result.pluginSrcFolder) {
                    return writeErrorMessage("The path to your plugin's TS/JS source code is required to correctly setup the plugin.");
                }

                inputParams.pluginSrcFolder = result.pluginSrcFolder;
                inputParams.pluginPlatformFolder = result.pluginSrcFolder + "/platforms";
                askNativeIosSrcFolder();
            });
        } else {
            askNativeIosSrcFolder();
        }
    }

    function askNativeIosSrcFolder() {
        if (inputParams.pluginIosSrcFolder == undefined) {
            prompt.get({
                name: 'pluginIosSrcFolder',
                description: "What the path to your plugin's native iOS source code ?"
            }, function (err, result) {
                if (err) {
                    return writeErrorMessage(err);
                }
                if (!result.pluginIosSrcFolder) {
                    return writeErrorMessage("The path to your plugin's native iOS source code is required to correctly setup the plugin.");
                }

                inputParams.pluginIosSrcFolder = result.pluginIosSrcFolder;
                askNativeAndroidSrcFolder();
            });
        } else {
            askNativeAndroidSrcFolder();
        }
    }

    function askNativeAndroidSrcFolder() {
        if (inputParams.pluginAndroidSrcFolder == undefined) {
            prompt.get({
                name: 'pluginAndroidSrcFolder',
                description: "What the path to your plugin's native Android source code ?"
            }, function (err, result) {
                if (err) {
                    return writeErrorMessage(err);
                }
                if (!result.pluginAndroidSrcFolder) {
                    return writeErrorMessage("The path to your plugin's native Android source code is required to correctly setup the plugin.");
                }

                inputParams.pluginAndroidSrcFolder = result.pluginAndroidSrcFolder;
                askAndroidLibraryName();
            });
        } else {
            askAndroidLibraryName();
        }
    }

    function askAndroidLibraryName() {
        if (inputParams.androidLibraryName == undefined) {
            prompt.get({
                name: 'androidLibraryName',
                description: "What is the name (no spaces) of the native Android library (.arr file) of your Android Studio proj ?"
            }, function (err, result) {
                if (err) {
                    return writeErrorMessage(err);
                }
                if (!result.androidLibraryName) {
                    return writeErrorMessage("The path to your plugin's TS/JS source code is required to correctly setup the plugin.");
                }

                inputParams.androidLibraryName = result.androidLibraryName;
                askDemoFolder();
            });
        } else {
            askDemoFolder();
        }
    }

    function askDemoFolder() {
        if (inputParams.demoFolder == undefined) {
            prompt.get({
                name: 'demoFolder',
                description: "Where is the NS application you want to use ? (or use 'default' from plugin seed)"
            }, function (err, result) {
                if (err) {
                    return writeErrorMessage(err);
                }

                if (result.demoFolder == "default") {
                    inputParams.demoFolder = defaultDemoPath;
                    inputParams.demoAngularFolder = defaultDemoAngularPath;
                    writeToSrcJson();
                    return;
                }

                if (!result.demoFolder) {
                    return writeErrorMessage("An NS application is required in order to be able to debug your source code.");
                }

                inputParams.demoFolder = result.demoFolder;
                askDemoAngularFolder();
            });
        } else {
            askDemoAngularFolder();
        }
    }

    function askDemoAngularFolder() {
        if (inputParams.demoAngularFolder == undefined) {
            prompt.get({
                name: 'demoAngularFolder',
                description: "Where is the NS + Angular application you want to use ?"
            }, function (err, result) {
                if (err) {
                    return writeErrorMessage(err);
                }

                if (isDeclineInput(result.demoAngularFolder)) {
                    writeErrorMessage("NS + Angular application not configured. Using any of the commands for 'demo.angular' will not work.");
                    writeToSrcJson();

                    return;
                }

                inputParams.demoAngularFolder = result.demoAngularFolder;
                writeToSrcJson();
            });
        } else {
            writeToSrcJson();
        }
    }

    function writeToSrcJson() {
        const scriptsTag = "scripts";
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
            inputParams.androidLibraryName);
        var predefinedDevDependencies = predefinedDepsModule.getDevDependencies();

        var jsonScripts = jsonObject[scriptsTag];
        var jsonDevDeps = jsonObject[devDepsTag];
        var newScripts = updateJson(predefinedScripts, jsonScripts);
        var newDevDeps = updateDevDependencies(predefinedDevDependencies, jsonDevDeps);

        jsonObject[scriptsTag] = newScripts;
        jsonObject[devDepsTag] = newDevDeps;
        fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));

        var ndJson = {};
        var pluginScriptsJson = {};
        var pluginDescriptionsJson = {};
        var pluginCategoriesJson = {};
        var pluginScripts = updateJson(predefinedScripts, pluginScriptsJson);
        var descriptions = updateDescriptions(predefinedScripts, pluginDescriptionsJson);
        var categories = updateCategories(predefinedScripts, pluginCategoriesJson);
        ndJson[scriptsTag] = pluginScripts;
        ndJson[devDepsTag] = newDevDeps;
        ndJson[descriptionsTag] = descriptions;
        ndJson[categoriesTag] = categories;
        var ndJsonPath = inputParams.pluginSrcFolder + "/node_modules/nativescript-dev-debugging/scripts/nd-package.json";
        fs.writeFileSync(ndJsonPath, JSON.stringify(ndJson, null, "\t"));

        console.log(chalk.blue("'nativescript-dev-debugging': Plugin Configuration Successful"));
        console.log(chalk.blue("'nativescript-dev-debugging': Run") + chalk.yellow(' $ npm run nd.help all') + chalk.blue(" to see the available functionality"));
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

    function updateJson(newScripts, jsonScripts) {
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
}

function isDeclineInput(input) {
    var lowerCaseInput = input.toLowerCase();
    return lowerCaseInput == "" || lowerCaseInput == "no";
}

function isAgreeInput(input) {
    return input.toLowerCase() == "yes";
}

function writeErrorMessage(message) {
    console.log(chalk.red(message));
    console.log(chalk.blue("In order to configure the 'nativescript-dev-debugging' plugin run:") + chalk.yellow(" $ node node_modules/nativescript-dev-debugging/index.js"));
}