# nativescript-dev-debugging

This dev plugin allows an __NativeScript plugin authors__ to use a **predefined workflow** with which you can **develop** and **debug** both the **native iOS/Android** and the **TypeScript/JavaScript** wrapper source code of their NS plugin. The main API that this plugin exposes is through `npm scripts` which will be saved to your package.json of your plugin's source code.

Note
> - This NS dev plugin has been developed on Mac and has not been tested on Windows.
> - Using the plugin's scripts will open both Android Studio and XCode so be aware that those applications will open during the executing of the scripts.
> - This plugin uses the `--syncAllFiles` to ensure that all of your NS plugin source code changes are transferred when changes are detected.

## Installation

### Requirements

- npm 6.4.1 or above (`npm --version`)
- NativeScript 5.1.0 or above (`$ tns --version`)
- Xcode 10.1 Build version 10B61 (`$ xcodebuild -version`)
- Android Studio 3.2.1 or above (`$ mdls -name kMDItemVersion /Applications/Android\ Studio.app`)
- The Xcode project of your plugin has to have a build schema with the name of the framework that it creates (for example the project that creates 'TNSWidgets.framework' has a schema named 'TNSWidgets')

The first thing you need to do is install the plugin:

- npm install nativescript-dev-debugging --save-dev
- During installation the plugin requires you to provide configuration of the location and relative information about your source code. Here there are two options you can use 

**A fresh configuration**

Simply install the package and follow the prompts, there are two options one of which minimizes the asked inputs by following the 'plugin seed' structure and a second option which is fully manual configuration and is recommended if you have not followed the NativeScript plugin seed structure.

or

**Configuration using a nd.config.json file**

You can take a look at ["Configuration file"](#config_file) section bellow for details about the required contents of the configuration file. To use an nd.config.json file during package installation simply create a file named __nd.config.json__ in the root of your plugins source code (where its package.json file is) and install the package as normally.


### Manual configuration

Recommended for plugins that **have not used** the [NativeScript plugin seed](https://github.com/NativeScript/nativescript-plugin-seed) as a starting point. The post install script will ask for the following configuration settings of your plugin's structure:

- The "path" to the folder which hold your plugin's TypeScript/JavaScript and package.json
- The "path" to the folder which hold your plugin's 'platforms' contents ('android' and 'ios' folders)
- The "path" to the native iOS source code of the Xcode project from which the iOS framework of your plugin has been build
- The name of the name of the iOS framework of your plugin
- The "path" to the native Android source code of the Android Studio project from which the Android library of your plugin has been build
- The name of the name of the Android library of your plugin
- The "path" to the folder which hold the NativeScript Vanila application used as demo of your plugin
- The "path" to the folder which hold the NativeScript + Angular application used as demo of your plugin (optional)
- The Apple provisioning profile that is required for the above NativeScript application (optional) 

### "Plugin seed" friendly configuration

Recommended for plugins that **have used** the [NativeScript plugin seed](https://github.com/NativeScript/nativescript-plugin-seed) as a starting point. The post install script will ask for the following configuration settings of your plugin's structure:

The post install script will ask for the following configuration settings of your plugin's structure:

- The "path" to the folder which hold your plugin's TypeScript/JavaScript and package.json
- The name of the name of the iOS framework of your plugin
- The name of the name of the Android library of your plugin
- The Apple provisioning profile that is required for the above NativeScript application (optional)

### <a name="config_file"></a>Configuration file

After either of the above configuration stages the configuration parameters you have entered will be written locally to an configuration json file called `nd-config.json`. You cna manually create this file in the root (where the package.json of your {N} plugin source code is) and pre-configure it so that when the npm postinstall script is ran it will skip app prompts of the nativescript-dev-debugging plugin configuration stage. Here are all the require configuration key/value pairs:

```
{
	"pluginSrcFolder": "/Users/USER/plugin_repo/src",
	"pluginPlatformFolder": "/Users/USER/plugin_repo/src/platforms",
	"pluginIosSrcFolder": "/Users/USER/plugin_repo/src-native/ios",
	"iosLibraryName": "LibraryName",
	"pluginAndroidSrcFolder": "/Users/USER/plugin_repo/src-native/android",
	"androidLibraryName": "LibraryName",
	"demoFolder": "/Users/USER/plugin_repo/demo",
	"demoAngularFolder": "/Users/USER/plugin_repo/demo-angular",
	"demoVueFolder": "/Users/USER/plugin_repo/demo-vue",
	"provisioningProfile": "TestProfile"
}
```

# Usage of the build-in 'workflows'

The exposed API of this dev plugin is though the use of npm scripts. After the installation and configuration steps the package.json of your plugin will be modified with scripts, watchers and some dev dependencies. You should keep all of them and not manually change them to make sure that the functionality of the `nativescript-dev-debugging` is working as expected. If you want to reconfigure the plugin simply execute `npm run nd.config`

## Starting a 'workflow'

In order to start a 'workflow' you can use the separate npm scripts like `npm run nd.demo.ios.device` and `npm run nd.demo.android` or use the 'interactive script command' `nd.run`. If you are not aware of which workflow you want to start it is best to use `npm run nd.run` and follow the prompts.

For full details regarding the build-in functionality of this plugin execute `npm run nd.help`.

## Workflow for "Changes to NS app and the TypeScript/JavaScript of your plugin"

When you would like to make changes to your NativeScript application and the "wrapper" TypeScript/JavaScript of your plugin and also be able to attach your native source code to the deployed app you should use the commands from the `debugNative` section of the help, to see all commands run `npm run nd.help` and choose the `debugNative` option.

## Workflow for "Changes to native iOS/Android source code and the NS app and the TypeScript/JavaScript of your plugin"

When you would like to make changes to your NativeScript application and the "wrapper" TypeScript/JavaScript of your plugin and also be able to attach your native source code to the deployed app you should use the commands from the `developNative` section of the help, to see all commands run `npm run nd.help` and choose the `developNative` option.

# Contributing

In order to test the node package locally:
- Open the app folder `cd app`
- Run `npm i`
- Run `npm run install` - will execute the package's postinstall scrip like it is being installed in the app folder for the first time
- Run `npm run install <full path to a 'nd-config.json' file>` - will execute the package's postinstall scrip with the configuration of the `nd-config.json` file