# nativescript-dev-debugging

This package allows the developer of an **NativeScript plugin** to use a **workflow that allows to debugging** of both the native iOS (objective-c, swift) and Android (Java) code and the wrapper TypeScript/JavaScript code of the plugin used inside an NativeScript application. This is a powerful \"tool\" which will rebuild both the native .framework (iOS) and .arr files (Android) and the TypeScript/JavaScript code of your NativeScript plugin and guide you to the corresponding IDE that will allow you to debug 100% of the source code of your NativeScript plugin.

Note
> This dev nodejs package has been developed on Mac and has not been tested on Windows.


Note
> Using the package's scripts will open both Android Studio and XCode so be aware that those applications will open during the executing of the scripts.

# Contributing

In order to test the node package locally:
- Open the app folder `cd app`
- Run `npm i`
- Run `npm run test` - will execute the package's postinstall scrip like it is being installed in the app folder for the first time
- Run `npm run test dev` - will execute the package's postinstall scrip like it is being installed in the app folder for the first time and pre fill all required user inputs that are used to manage the package's scripts