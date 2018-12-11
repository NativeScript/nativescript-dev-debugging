# nativescript-dev-debugging

This dev plugin allows an __NativeScript plugin authors__ to use a **predefined workflow** with which you can **develop** and **debug** both the **native iOS/Android** and the **TypeScript/JavaScript** wrapper source code of their NS plugin. THe main API that this plugin exposes is through `npm scripts` which will be saved to your package.json of your plugin's source code.

Note
> - This NS dev plugin has been developed on Mac and has not been tested on Windows.
> - Using the plugin's scripts will open both Android Studio and XCode so be aware that those applications will open during the executing of the scripts.
> - This plugin uses the `--syncAllFiles` to ensure that all of your NS plugin source code changes are transferred when changes are detected.

## Installation

The first thing you need to do is install the plugin:

- npm install nativescript-dev-debugging --save-dev
- After that configuration wizard will be started. You have the option to use "completely manual configuration" or "plugin seed friendly configuration"

### Completely manual configuration

- The "path" to the folder which hold your plugin's TypeScript/JavaScript and package.json
- The "path" to the native iOS source code of the Xcode project from which the iOS framework of your plugin has been build
- The name of the name of the iOS framework of your plugin
- The "path" to the native Android source code of the Android Studio project from which the Android library of your plugin has been build
- The name of the name of the Android library of your plugin
- The "path" to the folder which hold the NativeScript Vanila application used as demo of your plugin
- The "path" to the folder which hold the NativeScript + Angular application used as demo of your plugin (optional)
- The Apple provisioning profile that is required for the above NativeScript application (optional) 

### Plugin seed friendly configuration

- The "path" to the folder which hold your plugin's TypeScript/JavaScript and package.json
- The name of the name of the iOS framework of your plugin
- The name of the name of the Android library of your plugin
- The Apple provisioning profile that is required for the above NativeScript application (optional) 

# Usage and workflow

The exposed API of this dev plugin is though the use of npm scripts. After the installation and configuration steps the package.json of your plugin will be modified with scripts, watchers and some dev dependencies. You should keep all of them and not manually change them to make sure that the functionality of the `nativescript-dev-debugging` is working as expected. If you want to reconfigure the plugin simply execute `npm run nd.config`

For full details regarding the build-in functionality of this plugin execute `npm run nd.help`.

# Contributing

In order to test the node package locally:
- Open the app folder `cd app`
- Run `npm i`
- Run `npm run test` - will execute the package's postinstall scrip like it is being installed in the app folder for the first time
- Run `npm run test dev` - will execute the package's postinstall scrip like it is being installed in the app folder for the first time and pre fill all required user inputs that are used to manage the package's scripts