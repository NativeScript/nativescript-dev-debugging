var fs = require('fs');
var prompt = require('prompt');

// Expected input
t = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src/platforms";
nIOS = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/ios";
nAndroid = "/Users/amiorkov/Desktop/Work/nativescript-ui-listview/src-native/android";
package_json_folder_dummy = "/Users/amiorkov/Desktop/Work/nativescript-dev-debugging/app";

prompt.get({
    name: 'already_configured',
    description: "Did you already setup the plugin configuration?"
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

    inputParams.native_android_src_folder = nAndroid;
    inputParams.native_ios_src_folder = nIOS;
    inputParams.target_platform_folder = t;
    inputParams.plugin_json_file_folder = package_json_folder_dummy;


    console.log("'nativescript-dev-debugging' Plugin Configuration");

    var parseArgv = function () {
        var argv = Array.prototype.slice.call(process.argv, 2);
        var result = {};
        argv.forEach(function (pairString) {
            var pair = pairString.split('=');
            result[pair[0]] = pair[1];
        });
        return result;
    };
    var argv = parseArgv();

    if (argv.target_platform_folder !== undefined &&
        argv.native_ios_src_folder !== undefined &&
        argv.native_android_src_folder !== undefined &&
        argv.plugin_json_file_folder == undefined) {
        inputParams.target_platform_folder = argv.target_platform_folder;
        inputParams.native_ios_src_folder = argv.native_ios_src_folder;
        inputParams.native_android_src_folder = argv.native_android_src_folder;
        inputParams.plugin_json_file_folder = argv.plugin_json_file_folder;
    }

    const pluginScripts = [{
        key: "nd.prepare.demo.app.ios",
        value: "cd ../demo && tns prepare ios"
    },
    {
        key: "nd.prepare.demo.app.ios",
        value: "cd ../demo && tns prepare ios"
    },
    {
        key: "nd.prepare.demo.app.android",
        value: "cd ../demo && tns prepare android"
    },
    {
        key: "nd.prepare.demo.angular.app.ios",
        value: "cd ../demo-angular && tns prepare ios"
    },
    {
        key: "nd.prepare.demo.angular.app.android",
        value: "cd ../demo-angular && tns prepare android"
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
        value: "cd ../demo && tns run android --syncAllFiles"
    },
    {
        key: "nd.demo.run.ios",
        value: "cd ../demo && tns run ios --syncAllFiles --provision NativeScriptDevProfile"
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
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Debug -t " + inputParams.target_platform_folder + " -n " + inputParams.native_ios_src_folder + " pdf "
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
                description: "What the path to the 'platforms' directory of your platform?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.target_platform_folder) {
                    return console.log("The 'platforms' directory path is required to correctly setup the plugin.");
                }
                inputParams.target_platform_folder = result.target_platform_folder;
            });
        }

        askNativeIosSrcFolder();
    }

    function askNativeIosSrcFolder() {
        if (inputParams.native_ios_src_folder == undefined) {
            generateClassName();
            prompt.get({
                name: 'native_ios_src_folder',
                description: "What the path to your plugin's native source code?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.native_ios_src_folder) {
                    return console.log("The path to your plugin's native source code is required to correctly setup the plugin.");
                }

                inputParams.native_ios_src_folder = result.native_ios_src_folder;
            });
        }

        askNativeAndroidSrcFolder();
    }

    function askNativeAndroidSrcFolder() {
        if (inputParams.native_android_src_folder == undefined) {
            prompt.get({
                name: 'native_android_src_folder',
                description: "What the path to your plugin's native source code?"
            }, function (err, result) {
                if (err) {
                    return console.log(err);
                }
                if (!result.native_android_src_folder) {
                    return console.log("The path to your plugin's native source code is required to correctly setup the plugin.");
                }

                inputParams.native_ios_src_folder = result.native_ios_src_folder;

            });
        }

        writeToSrcJson();
    }

    function writeToSrcJson() {
        var path = inputParams.plugin_json_file_folder + "/package.json";
        let jsonFile = fs.readFileSync(path);
        var jsonObject = JSON.parse(jsonFile);
        console.log(jsonObject);

        jsonKeys = Object.keys(jsonObject);
        var jsonScripts = jsonObject["scripts"];
        pluginScripts.forEach((script) => {
            jsonScripts[script.key] = script.value;
        });
        jsonObject["scripts"] = jsonScripts;
        fs.writeFileSync(path, JSON.stringify(jsonObject, null, "\t"));
    }
}