function getPluginPreDefinedScripts(demoFolder, demoAngularFolder, pluginPlatformFolder, pluginIosSrcFolder, pluginAndroidSrcFolder, androidLibraryName, provisioningProfile) {
    var provisioningParam = "";
    if (provisioningProfile != "none") {
        provisioningParam = "  --provision " + provisioningProfile;
    }

    return [{
        key: "nd.help",
        value: "node node_modules/nativescript-dev-debugging/scripts/help.js",
        description: "Display the help section, available commands etc.",
        category: "help"
    },
    {
        key: "nd.config",
        value: "node node_modules/nativescript-dev-debugging/index.js",
        description: "Start the interactive configuration of the 'nativescript-dev-debugging' plugin",
        category: "help"
    },
    {
        key: "nd.build",
        value: "npm run nd.build.release.native.ios && npm run nd.build.release.native.android",
        description: "Executes scripts that will build your native iOS and Android source code (for release) and move it to the 'platforms' folder of your NS plugin",
        category: "build"
    },
    {
        key: "nd.build.simulator",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.build.native.android",
        description: "Executes scripts that will build your native iOS (for simulator) and Android source code (for debug) and move it to the 'platforms' folder of your NS plugin",
        category: "build"
    },
    {
        key: "nd.build.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.build.native.android",
        description: "Executes scripts that will build your native iOS (for real device) and Android source code (for debug) and move it to the 'platforms' folder of your NS plugin",
        category: "build"
    },
    {
        key: "nd.demo.debug.native.attach.android",
        value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.run.android",
        description: "Runs your 'demo' app and opens Android Studio. After that use 'Attach debugger to Android process (demo)' to debug the native source code",
        category: "main run"
    },
    {
        key: "nd.demo.debug.native.attach.ios",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios",
        description: "Runs your 'demo' app and opens Xcode. After that use 'Attach to process by PID or Name (demo)' to debug the native source code. (for simulator)",
        category: "main run"
    },
    {
        key: "nd.demo.debug.native.attach.ios.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios",
        description: "Runs your 'demo' app and opens Xcode. After that use 'Attach to process by PID or Name (demo)' to debug the native source code. (for real device)",
        category: "main run"
    },
    {
        key: "nd.demo.angular.debug.native.attach.android",
        value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.angular.run.android",
        description: "Runs your 'demo-angular' app and opens Android Studio. After that use 'Attach debugger to Android process (demo)' to debug the native source code",
        category: "main run"
    },
    {
        key: "nd.demo.angular.debug.native.attach.ios",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios",
        description: "Runs your 'demo' app and opens Xcode. After that use 'Attach to process by PID or Name (demo)' to debug the native source code. (for simulator)",
        category: "main run"
    },
    {
        key: "nd.demo.angular.debug.native.attach.ios.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios",
        description: "Runs your 'demo' app and opens Xcode. After that use 'Attach to process by PID or Name (demo)' to debug the native source code. (for real device)",
        category: "main run"
    },
    {
        key: "nd.open.xcode",
        value: "cd ../src-native/ios && open *.xcodeproj && cd ../../src",
        description: "Opens your plugin's native iOS source code in Xcode",
        category: "helper"
    },
    {
        key: "nd.open.android.studio",
        value: "open -a /Applications/Android\\ Studio.app ../src-native/android",
        description: "Opens your plugin's native Android source code in Android Studio",
        category: "helper"
    },
    {
        key: "nd.attach.native.debugger.ios",
        value: "npm run nd.build.debug.simulator.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src",
        description: "Rebuilds the plugin's native source code and opens it in Xcode. (for simulator)",
        category: "attach"
    },
    {
        key: "nd.attach.native.debugger.ios.device",
        value: "npm run nd.build.debug.device.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src",
        description: "Rebuilds the plugin's native source code and opens it in Xcode. (for real device)",
        category: "attach"
    },
    {
        key: "nd.attach.native.debugger.android",
        value: "npm run nd.build.native.android && cd ../src-native/ios && npm run nd.open.android.studio && cd ../../src",
        description: "Rebuilds the plugin's native source code and opens it in Android Studio",
        category: "attach"
    },
    {
        key: "nd.prepare.demo.app.ios",
        value: "cd " + demoFolder + " && tns prepare ios",
        description: "Executes 'tns prepare ios' for the 'demo' app",
        category: "prepare"
    },
    {
        key: "nd.prepare.demo.app.android",
        value: "cd " + demoFolder + " && tns prepare android",
        description: "Executes 'tns prepare android' for the 'demo' app",
        category: "prepare"
    },
    {
        key: "nd.prepare.demo.angular.app.ios",
        value: "cd " + demoAngularFolder + " && tns prepare ios",
        description: "Executes 'tns prepare ios' for the 'demo angular' app",
        category: "prepare"
    },
    {
        key: "nd.prepare.demo.angular.app.android",
        value: "cd " + demoAngularFolder + " && tns prepare android",
        description: "Executes 'tns prepare android' for the 'demo angular' app",
        category: "prepare"
    },
    {
        key: "nd.demo.debug.native.ios",
        value: "npm-watch nd.prepare.demo.app.ios",
        description: "Triggers file watcher for the native iOS source code, when change is detected rebuilds the 'demo' app and runs it. (COMING SOON)",
        category: "run"
    },
    {
        key: "nd.demo.debug.native.android",
        value: "npm-watch nd.prepare.demo.app.android",
        description: "Triggers file watcher for the native Android source code, when change is detected rebuilds the 'demo' app and runs it. (COMING SOON)",
        category: "run"
    },
    {
        key: "nd.demo.angular.debug.native.ios",
        value: "npm-watch nd.prepare.demo.angular.app.ios",
        description: "Triggers file watcher for the native iOS source code, when change is detected rebuilds the 'demo-angular' app and runs it. (COMING SOON)",
        category: "run"
    },
    {
        key: "nd.demo.angular.debug.native.android",
        value: "npm-watch nd.prepare.demo.angular.app.android",
        description: "Triggers file watcher for the native Android source code, when change is detected rebuilds the 'demo-angular' app and runs it. (COMING SOON)",
        category: "run"
    },
    {
        key: "nd.demo.run.android",
        value: "cd " + demoFolder + " && tns run android --syncAllFiles",
        description: "Runs the 'demo' app on Android with '--syncAllFiles' argument",
        category: "run"
    },
    {
        key: "nd.demo.run.ios",
        value: "cd " + demoFolder + " && tns run ios" + provisioningParam,
        description: "Runs the 'demo' app on iOS with '--syncAllFiles' argument",
        category: "run"
    },
    {
        key: "nd.demo.angular.run.android",
        value: "cd " + demoFolder + " && tns run android --syncAllFiles",
        description: "Runs the 'demo-angular' app on Android with '--syncAllFiles' argument",
        category: "run"
    },
    {
        key: "nd.demo.angular.run.ios",
        value: "cd " + demoFolder + " && tns run ios --syncAllFiles" + provisioningParam,
        description: "Runs the 'demo-angular' app on iOS with '--syncAllFiles' argument",
        category: "run"
    },
    {
        key: "nd.build.debug.simulator.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Simulator -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "Builds the native iOS source code in debug mode for simulator. (preferably use 'nd.build.simulator')",
        category: "build"
    },
    {
        key: "nd.build.debug.device.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Device -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "Builds the native iOS source code in debug mode for real device. (preferably use 'nd.build.simulator')",
        category: "build"
    },
    {
        key: "nd.build.native.android",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Debug -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf ",
        description: "Builds the native Android source code in debug mode for simulator. (preferably 'use nd.build.simulator')",
        category: "build"
    },
    {
        key: "nd.build.release.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "Builds the native iOS source code in release mode. (preferably use 'nd.build')",
        category: "build"
    },
    {
        key: "nd.build.release.native.android",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf ",
        description: "Builds the native Android source code in release mode. (preferably use 'nd.build')",
        category: "build"
    }];
}

module.exports.getPluginPreDefinedScripts = getPluginPreDefinedScripts;