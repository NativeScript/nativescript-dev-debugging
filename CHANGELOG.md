# Version 1.0.1

## Fixed:

- When saving a change to a file in Xcode during a "Attach to process", after new app deploy and "Attach to process" the break points are not hit. ([#2](https://github.com/NativeScript/nativescript-dev-debugging/issues/2))

# Version 1.0.0

## Fixed:

- Removed 'npw-watch' as peer dependency
- Resolve issues with "watch" option when starting a workflow for iOS
- Renamed 'watch' to 'attach & watch' option of `nd-run` to better illustrate the workflow it will trigger
- Resolve issue with 'watch' workflow for iOS where simply changing between files in Xcode will trigger new "build" of the workflow

## Features:

- New file watcher implemented
- Added new sections describing how to use the `nd.run` command to start a workflow and what those workflows can and should be used for. More details [here](https://github.com/NativeScript/nativescript-dev-debugging/tree/master#workflow-for-observingdebug-the-native-code)
- Optimized the output of the `nd.help` command

# Version 0.1.0

Initial version of the plugin
