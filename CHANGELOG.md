# Version 0.2.0

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