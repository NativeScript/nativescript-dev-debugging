var fs = require('fs');
var prompt = require('prompt');
var predefinedScriptsModule = require('./predefined-scripts');
var predefinedDepsModule = require('./predefined-dev-deps');
var nativeIosFolder = undefined;
var nativeAndroidFolder = undefined;
var packageJsonFolder = undefined;
var androidLibraryName = undefined;
var demoFolder = "../demo";
var demoAngularFolder = "../demo-angular";

function isLocalTesting() {
    return process.argv[2] == "dev";
}

if (isLocalTesting()) {
    // Expected input from user. This is for local development purpose and is coupled with the nativescript-ui-listview plugin's source code
    nativeIosFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/ios";
    nativeAndroidFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/android";
    packageJsonFolder = "/Users/amiorkov/Desktop/Work/nativescript-dev-debugging/app";
    androidLibraryName = "TNSListView";
}

console.log("'nativescript-dev-debugging': Plugin Configuration started ...");
console.log("Notes: If you want to configure the plugin from start run: $ node node_modules/nativescript-dev-debugging/index.js");

if (!isLocalTesting()) {
    prompt.start();
    prompt.get({
        name: 'already_configured',
        description: "Did you already setup the plugin configuration? (yes/no)"
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        if (result.already_configured.toLowerCase() == "yes") {
        } else {
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
                    return console.log(err);
                }
                if (!result.pluginSrcFolder) {
                    return console.log("The path to your plugin's TS/JS source code is required to correctly setup the plugin.");
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
                    return console.log(err);
                }
                if (!result.pluginIosSrcFolder) {
                    return console.log("The path to your plugin's native iOS source code is required to correctly setup the plugin.");
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
                    return console.log(err);
                }
                if (!result.pluginAndroidSrcFolder) {
                    return console.log("The path to your plugin's native Android source code is required to correctly setup the plugin.");
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
                    return console.log(err);
                }
                if (!result.androidLibraryName) {
                    return console.log("The path to your plugin's TS/JS source code is required to correctly setup the plugin.");
                }

                inputParams.androidLibraryName = result.androidLibraryName;
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
        var path = inputParams.pluginSrcFolder + "/package.json";
        let jsonFile = fs.readFileSync(path);
        var jsonObject = JSON.parse(jsonFile);
        var predefinedScripts = predefinedScriptsModule.getPluginPreDefinedScripts(demoFolder, demoAngularFolder, inputParams.pluginPlatformFolder, inputParams.pluginIosSrcFolder, inputParams.pluginAndroidSrcFolder, inputParams.androidLibraryName);
        var predefinedDevDependencies = predefinedDepsModule.getDevDependencies();

        var jsonScripts = jsonObject[scriptsTag];
        var jsonDevDeps = jsonObject[devDepsTag];
        var newScripts = updateJson(predefinedScripts, jsonScripts);
        var newDevDeps = updateDevDependencies(predefinedDevDependencies, jsonDevDeps);

        jsonObject[scriptsTag] = newScripts;
        jsonObject[devDepsTag] = newDevDeps;
        fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));

        var ndJson = {};
        var pluginScriptsJson = { };
        var pluginDescriptionsJson = { };
        var pluginScripts = updateJson(predefinedScripts, pluginScriptsJson);
        var descriptions = updateDescriptions(predefinedScripts, pluginDescriptionsJson);
        ndJson[scriptsTag] = pluginScripts;
        ndJson[devDepsTag] = newDevDeps;
        ndJson[descriptionsTag] = descriptions;
        var ndJsonPath = inputParams.pluginSrcFolder + "/node_modules/nativescript-dev-debugging/scripts/nd-package.json";
        fs.writeFileSync(ndJsonPath, JSON.stringify(ndJson, null, "\t"));

        console.log("'nativescript-dev-debugging': Plugin Configuration Successful");
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
}