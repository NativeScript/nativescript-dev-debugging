var fs = require('fs');
var prompt = require('prompt');
var pluginPlatformsFolder = undefined;
var nativeIosFolder = undefined;
var nativeAndroidFolder = undefined;
var packageJsonFolder = undefined;
var androidLibraryName = undefined;
var demoFolder = "../demo";
var demoAngularFolder = "../demo-angular";

if (process.argv[2] == "dev") {
    // Expected input from user
    pluginPlatformsFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src/platforms";
    nativeIosFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/ios";
    nativeAndroidFolder = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/android";
    packageJsonFolder = "/Users/amiorkov/Desktop/Work/nativescript-dev-debugging/app";
    androidLibraryName = "TNSListView";
}


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

function configurePlugin() {
    var inputParams = {
        target_platform_folder: undefined,
        native_ios_src_folder: undefined,
        native_android_src_folder: undefined,
        scripts_dir: undefined
    };

    inputParams.native_android_src_folder = nativeAndroidFolder;
    inputParams.native_ios_src_folder = nativeIosFolder;
    inputParams.target_platform_folder = pluginPlatformsFolder;
    inputParams.plugin_json_file_folder = packageJsonFolder;
    inputParams.androidLibraryName = androidLibraryName;


    console.log("'nativescript-dev-debugging' Plugin Configuration");

    const pluginScripts = [{
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
        value: "npm run build.debug && npm run nd.open.android.studio && npm run nd.demo.run.android"
    },
    {
        key: "nd.demo.debug.native.attach.ios",
        value: "npm run build.debug && npm run nd.open.xcode && npm run nd.demo.run.ios"
    },
    {
        key: "nd.demo.angular.debug.native.attach.android",
        value: "npm run build.debug && npm run nd.open.android.studio && npm run nd.demo.angular.run.android"
    },
    {
        key: "nd.demo.angular.debug.native.attach.ios",
        value: "npm run build.debug && npm run nd.open.xcode && npm run nd.demo.angular.run.ios"
    },
    {
        key: "nd.attach.native.debugger.ios",
        value: "npm run build.debug && cd ../src-native/ios && run nd.open.xcode && cd ../../src"
    },
    {
        key: "nd.attach.native.debugger.android",
        value: "npm run build.debug && cd ../src-native/ios && npm run nd.open.android.studio && cd ../../src"
    },
    {
        key: "nd.build.debug.simulator.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Simulator -t " + inputParams.target_platform_folder + " -n " + inputParams.native_ios_src_folder + " pdf"
    },
    {
        key: "nd.build.debug.device.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Device -t " + inputParams.target_platform_folder + " -n " + inputParams.native_ios_src_folder + " pdf"
    },
    {
        key: "nd.build.native.android",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Debug -t " + inputParams.target_platform_folder + " -n " + inputParams.native_android_src_folder + " -f " + inputParams.androidLibraryName + " pdf "
    },
    {
        key: "nd.build.simulator",
        value: "npm run nd.build.native.android && npm run nd.build.debug.simulator.native.ios"
    },
    {
        key: "nd.build.device",
        value: "npm run nd.build.native.android && npm run nd.build.debug.device.native.ios"
    }];

    askPlatformsFolder();

    function askPlatformsFolder() {
        if (inputParams.target_platform_folder == undefined) {
            prompt.start();
            prompt.get({
                name: 'target_platform_folder',
                description: "What the path to the 'platforms' directory of your platform ?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.target_platform_folder) {
                    return console.log("The 'platforms' directory path is required to correctly setup the plugin.");
                }
                inputParams.target_platform_folder = result.target_platform_folder;
                askNativeIosSrcFolder();
            });
        } else {
            askNativeIosSrcFolder();
        }
    }

    function askNativeIosSrcFolder() {
        if (inputParams.native_ios_src_folder == undefined) {
            prompt.get({
                name: 'native_ios_src_folder',
                description: "What the path to your plugin's native iOS source code ?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.native_ios_src_folder) {
                    return console.log("The path to your plugin's native iOS source code is required to correctly setup the plugin.");
                }

                inputParams.native_ios_src_folder = result.native_ios_src_folder;
                askNativeAndroidSrcFolder();
            });
        } else {
            askNativeAndroidSrcFolder();
        }
    }

    function askNativeAndroidSrcFolder() {
        if (inputParams.native_android_src_folder == undefined) {
            prompt.get({
                name: 'native_android_src_folder',
                description: "What the path to your plugin's native Android source code ?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.native_android_src_folder) {
                    return console.log("The path to your plugin's native Android source code is required to correctly setup the plugin.");
                }

                inputParams.native_ios_src_folder = result.native_ios_src_folder;
                askSrcFolder();
            });
        } else {
            askSrcFolder();
        }
    }

    function askSrcFolder() {
        if (inputParams.plugin_json_file_folder == undefined) {
            prompt.get({
                name: 'plugin_json_file_folder',
                description: "What the path to your plugin's TS/JS source code ?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.plugin_json_file_folder) {
                    return console.log("The path to your plugin's TS/JS source code is required to correctly setup the plugin.");
                }

                inputParams.plugin_json_file_folder = result.plugin_json_file_folder;
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
                description: "What is the name of the native Android library (.arr file) of your Android Studio proj ?"
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
        var path = inputParams.plugin_json_file_folder + "/package.json";
        let jsonFile = fs.readFileSync(path);
        var jsonObject = JSON.parse(jsonFile);
        jsonKeys = Object.keys(jsonObject);
        var jsonScripts = jsonObject["scripts"];
        pluginScripts.forEach((script) => {
            jsonScripts[script.key] = script.value;
        });
        jsonObject["scripts"] = jsonScripts;
        fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));
    }
}