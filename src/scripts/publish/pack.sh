#!/bin/bash
set -e
set -o pipefail

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_DIR="$CURRENT_DIR/../src"
TO_SOURCE_DIR="$CURRENT_DIR/src"
PACK_DIR="$CURRENT_DIR/package"
ROOT_DIR="$CURRENT_DIR/.."

install(){
    cd $CURRENT_DIR
    npm i
}

pack() {
    echo 'Clearing /src and /package...'
    node_modules/.bin/rimraf "$TO_SOURCE_DIR"
    node_modules/.bin/rimraf "$PACK_DIR"

    # copy src
    echo 'Copying src...'
    node_modules/.bin/ncp "$SOURCE_DIR" "$TO_SOURCE_DIR"

    # strip all scripts except postinstall
    node -e "const p = require(\"$SOURCE_DIR/package.json\"); for (const i in p.scripts) if (i !== 'postinstall') delete p.scripts[i]; console.log(JSON.stringify(p, null, 2));" > "$TO_SOURCE_DIR/package.json"

    # copy README & LICENSE to src
    echo 'Copying README and LICENSE to /src...'
    node_modules/.bin/ncp "$ROOT_DIR"/LICENSE.md "$TO_SOURCE_DIR"/LICENSE.md
    node_modules/.bin/ncp "$ROOT_DIR"/README.md "$TO_SOURCE_DIR"/README.md

    echo "Zip $XCFRAMEWORK_FILE to $PLUGIN_TARGET_SUBDIR"
    (
        cd $TO_SOURCE_DIR/platforms/ios
        zip -q -r --symlinks XCFrameworks.zip *.xcframework
        rm -rf *.xcframework
    )

    echo 'Creating package...'
    # create package dir
    mkdir "$PACK_DIR"

    # create the package
    cd "$PACK_DIR"
    npm pack "$TO_SOURCE_DIR"
    echo "Package created in $PACK_DIR"

    # delete source directory used to create the package
    cd ..
    node_modules/.bin/rimraf "$TO_SOURCE_DIR"
}

install && pack
