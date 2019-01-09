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

    # copy LICENSE to src
    echo 'Copying README & LICENSE to /src...'
    node_modules/.bin/ncp "$ROOT_DIR"/LICENSE "$TO_SOURCE_DIR"/LICENSE
    node_modules/.bin/ncp "$ROOT_DIR"/README.md "$TO_SOURCE_DIR"/README.md

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
