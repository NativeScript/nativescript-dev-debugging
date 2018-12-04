var fs = require('fs');
var prompt = require('prompt');
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

console.log("'nativescript-dev-debugging' Plugin Configuration");
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

    function getPluginPreDefinedScripts(demoFolder, demoAngularFolder, pluginPlatformFolder, pluginIosSrcFolder, pluginAndroidSrcFolder, androidLibraryName) {
        return [{
            key: "nd.prepare.demo.app.ios",
            value: "cd " + demoFolder + " && tns prepare ios"
        },
        {
            key: "nd.prepare.demo.app.ios",
            value: "cd " + demoFolder + " && tns prepare ios"
        },
        {
            key: "nd.prepare.demo.app.android",
            value: "cd " + demoFolder + " && tns prepare android"
        },
        {
            key: "nd.prepare.demo.angular.app.ios",
            value: "cd " + demoAngularFolder + " && tns prepare ios"
        },
        {
            key: "nd.prepare.demo.angular.app.android",
            value: "cd " + demoAngularFolder + " && tns prepare android"
        },
        {
            key: "nd.demo.debug.native.ios",
            value: "npm-watch nd.prepare.demo.app.ios"
        },
        {
            key: "nd.demo.debug.native.android",
            value: "npm-watch nd.prepare.demo.app.android"
        },
        {
            key: "nd.demo.angular.debug.native.ios",
            value: "npm-watch nd.prepare.demo.angular.app.ios"
        },
        {
            key: "nd.demo.angular.debug.native.android",
            value: "npm-watch nd.prepare.demo.angular.app.android"
        },
        {
            key: "nd.demo.run.android",
            value: "cd " + demoFolder + " && tns run android --syncAllFiles"
        },
        {
            key: "nd.demo.run.ios",
            value: "cd " + demoFolder + " && tns run ios --syncAllFiles --provision NativeScriptDevProfile"
        },
        {
            key: "nd.demo.angular.run.android",
            value: "cd " + demoFolder + " && tns run android --syncAllFiles"
        },
        {
            key: "nd.demo.angular.run.ios",
            value: "cd " + demoFolder + " && tns run ios --syncAllFiles --provision NativeScriptDevProfile"
        },
        {
            key: "nd.open.xcode",
            value: "cd ../src-native/ios && open *.xcodeproj && cd ../../src"
        },
        {
            key: "nd.open.android.studio",
            value: "open -a /Applications/Android\\ Studio.app ../src-native/android"
        },
        {
            key: "nd.demo.debug.native.attach.android",
            value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.run.android"
        },
        {
            key: "nd.demo.debug.native.attach.ios",
            value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios"
        },
        {
            key: "nd.demo.debug.native.attach.ios.device",
            value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios"
        },
        {
            key: "nd.demo.angular.debug.native.attach.android",
            value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.angular.run.android"
        },
        {
            key: "nd.demo.angular.debug.native.attach.ios",
            value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios"
        },
        {
            key: "nd.demo.angular.debug.native.attach.ios.device",
            value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios"
        },
        {
            key: "nd.attach.native.debugger.ios",
            value: "npm run nd.build.debug.simulator.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src"
        },
        {
            key: "nd.attach.native.debugger.ios.device",
            value: "npm run nd.build.debug.device.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src"
        },
        {
            key: "nd.attach.native.debugger.android",
            value: "npm run nd.build.native.android && cd ../src-native/ios && npm run nd.open.android.studio && cd ../../src"
        },
        {
            key: "nd.build.debug.simulator.native.ios",
            value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Simulator -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf"
        },
        {
            key: "nd.build.debug.device.native.ios",
            value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Device -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf"
        },
        {
            key: "nd.build.native.android",
            value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Debug -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf "
        },
        {
            key: "nd.build.release.native.ios",
            value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf"
        },
        {
            key: "nd.build.release.native.android",
            value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf "
        },
        {
            key: "nd.build.simulator",
            value: "npm run nd.build.debug.simulator.native.ios && npm run nd.build.native.android"
        },
        {
            key: "nd.build.device",
            value: "npm run nd.build.debug.device.native.ios && npm run nd.build.native.android"
        },
        {
            key: "nd.build",
            value: "npm run nd.build.release.native.ios && npm run nd.build.release.native.android"
        }];
    }

    function writeToSrcJson() {
        var path = inputParams.pluginSrcFolder + "/package.json";
        let jsonFile = fs.readFileSync(path);
        var jsonObject = JSON.parse(jsonFile);
        jsonKeys = Object.keys(jsonObject);
        var jsonScripts = jsonObject["scripts"];
        var predefinedScripts = getPluginPreDefinedScripts(demoFolder, demoAngularFolder, inputParams.pluginPlatformFolder, inputParams.pluginIosSrcFolder, inputParams.pluginAndroidSrcFolder, inputParams.androidLibraryName);
        predefinedScripts.forEach((script) => {
            jsonScripts[script.key] = script.value;
        });
        jsonObject["scripts"] = jsonScripts;
        fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));
        console.log("'nativescript-dev-debugging' Plugin Configuration Successful");
    }
}