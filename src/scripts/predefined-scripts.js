function getPluginPreDefinedScripts(demoFolder, demoAngularFolder, pluginPlatformFolder, pluginIosSrcFolder, pluginAndroidSrcFolder, androidLibraryName) {
    return [{
        key: "nd.help",
        value: "node node_modules/nativescript-dev-debugging/scripts/help.js",
        description: "Display the help section, available commands etc."
    },
    {
        key: "nd.build",
        value: "npm run nd.build.release.native.ios && npm run nd.build.release.native.android",
        description: "."
    },
    {
        key: "nd.build.simulator",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.build.native.android",
        description: "."
    },
    {
        key: "nd.build.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.build.native.android",
        description: "."
    },
    {
        key: "nd.demo.debug.native.attach.android",
        value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.run.android",
        description: "."
    },
    {
        key: "nd.demo.debug.native.attach.ios",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios",
        description: "."
    },
    {
        key: "nd.demo.debug.native.attach.ios.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.run.ios",
        description: "."
    },
    {
        key: "nd.demo.angular.debug.native.attach.android",
        value: "npm run nd.build.native.android && npm run nd.open.android.studio && npm run nd.demo.angular.run.android",
        description: "."
    },
    {
        key: "nd.demo.angular.debug.native.attach.ios",
        value: "npm run nd.build.debug.simulator.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios",
        description: "."
    },
    {
        key: "nd.demo.angular.debug.native.attach.ios.device",
        value: "npm run nd.build.debug.device.native.ios && npm run nd.open.xcode && npm run nd.demo.angular.run.ios",
        description: "."
    },
    {
        key: "nd.open.xcode",
        value: "cd ../src-native/ios && open *.xcodeproj && cd ../../src",
        description: "."
    },
    {
        key: "nd.open.android.studio",
        value: "open -a /Applications/Android\\ Studio.app ../src-native/android",
        description: "."
    },
    {
        key: "nd.attach.native.debugger.ios",
        value: "npm run nd.build.debug.simulator.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src",
        description: "."
    },
    {
        key: "nd.attach.native.debugger.ios.device",
        value: "npm run nd.build.debug.device.native.ios && cd ../src-native/ios && run nd.open.xcode && cd ../../src",
        description: "."
    },
    {
        key: "nd.attach.native.debugger.android",
        value: "npm run nd.build.native.android && cd ../src-native/ios && npm run nd.open.android.studio && cd ../../src",
        description: "."
    },
    {
        key: "nd.prepare.demo.app.ios",
        value: "cd " + demoFolder + " && tns prepare ios",
        description: "Runs 'tns prepare ios' for the 'demo' app."
    },
    {
        key: "nd.prepare.demo.app.android",
        value: "cd " + demoFolder + " && tns prepare android",
        description: "Runs 'tns prepare android' for the 'demo' app."
    },
    {
        key: "nd.prepare.demo.angular.app.ios",
        value: "cd " + demoAngularFolder + " && tns prepare ios",
        description: "Runs 'tns prepare ios' for the 'demo angular' app."
    },
    {
        key: "nd.prepare.demo.angular.app.android",
        value: "cd " + demoAngularFolder + " && tns prepare android",
        description: "Runs 'tns prepare android' for the 'demo angular' app.."
    },
    {
        key: "nd.demo.debug.native.ios",
        value: "npm-watch nd.prepare.demo.app.ios",
        description: "Triggers a file watcher for the 'demo' app.."
    },
    {
        key: "nd.demo.debug.native.android",
        value: "npm-watch nd.prepare.demo.app.android",
        description: "."
    },
    {
        key: "nd.demo.angular.debug.native.ios",
        value: "npm-watch nd.prepare.demo.angular.app.ios",
        description: "."
    },
    {
        key: "nd.demo.angular.debug.native.android",
        value: "npm-watch nd.prepare.demo.angular.app.android",
        description: "."
    },
    {
        key: "nd.demo.run.android",
        value: "cd " + demoFolder + " && tns run android --syncAllFiles",
        description: "."
    },
    {
        key: "nd.demo.run.ios",
        value: "cd " + demoFolder + " && tns run ios --syncAllFiles --provision NativeScriptDevProfile",
        description: "."
    },
    {
        key: "nd.demo.angular.run.android",
        value: "cd " + demoFolder + " && tns run android --syncAllFiles",
        description: "."
    },
    {
        key: "nd.demo.angular.run.ios",
        value: "cd " + demoFolder + " && tns run ios --syncAllFiles --provision NativeScriptDevProfile",
        description: "."
    },
    {
        key: "nd.open.xcode",
        value: "cd ../src-native/ios && open *.xcodeproj && cd ../../src",
        description: "."
    },
    {
        key: "nd.open.android.studio",
        value: "open -a /Applications/Android\\ Studio.app ../src-native/android",
        description: "."
    },
    {
        key: "nd.build.debug.simulator.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Simulator -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "."
    },
    {
        key: "nd.build.debug.device.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Debug -d Device -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "."
    },
    {
        key: "nd.build.native.android",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Debug -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf ",
        description: "."
    },
    {
        key: "nd.build.release.native.ios",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-ios.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginIosSrcFolder + " pdf",
        description: "."
    },
    {
        key: "nd.build.release.native.android",
        value: "sh ./node_modules/nativescript-dev-debugging/scripts/build-android.sh -b Release -t " + pluginPlatformFolder + " -n " + pluginAndroidSrcFolder + " -f " + androidLibraryName + " pdf ",
        description: "."
    }];
}

module.exports.getPluginPreDefinedScripts = getPluginPreDefinedScripts;