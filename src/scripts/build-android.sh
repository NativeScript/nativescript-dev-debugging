set -e
set -o pipefail

BUILD_FLAVOR="Release"

while getopts b:t:n:f: option
do
    case "${option}"
        in
    b) BUILD_FLAVOR=${OPTARG};;
    t) PLUGIN_TARGET_DIR=${OPTARG};;
    n) ANDROID_SOURCE_DIR=${OPTARG};;
    f) SOURCE_NAME=${OPTARG};;
    esac
done

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# ANDROID_SOURCE_DIR="$CURRENT_DIR/../../../../src-native/android"

PROJECT_NAME="$SOURCE_NAME"
RELEASE_AAR_FILE=$PROJECT_NAME-release.aar
DEBUG_AAR_FILE=$PROJECT_NAME-Debug.aar

BUILD_OUTPUT_DIR="$ANDROID_SOURCE_DIR/$PROJECT_NAME/build/outputs/aar/"

# PLUGIN_TARGET_DIR="$CURRENT_DIR/../../../../src/platforms"
PLUGIN_TARGET_SUBDIR="$PLUGIN_TARGET_DIR/android"

OUTPUT_RELEASE_AAR_FILE_DIR=$PLUGIN_TARGET_SUBDIR/$RELEASE_AAR_FILE
OUTPUT_DEBUG_AAR_FILE_DIR=$PLUGIN_TARGET_SUBDIR/$DEBUG_AAR_FILE

cd $ANDROID_SOURCE_DIR

if [ $BUILD_FLAVOR = "Debug" ]
then
    ./gradlew clean assembleDebug
else
    ./gradlew clean assembleRelease
fi

echo "$AAR_FILE was built in $BUILD_OUTPUT_DIR"

if [ ! -d $PLUGIN_TARGET_DIR ]; then
    mkdir $PLUGIN_TARGET_DIR
fi

if [ ! -d $PLUGIN_TARGET_SUBDIR ]; then
    mkdir $PLUGIN_TARGET_SUBDIR
fi

if [ -e $OUTPUT_RELEASE_AAR_FILE_DIR ]; then
    rm -rf $OUTPUT_RELEASE_AAR_FILE_DIR
fi

if [ -e $OUTPUT_DEBUG_AAR_FILE_DIR ]; then
    rm -rf $OUTPUT_DEBUG_AAR_FILE_DIR
fi

cp -R "$BUILD_OUTPUT_DIR/$AAR_FILE" $PLUGIN_TARGET_SUBDIR

echo "force livesync" > "$PLUGIN_TARGET_SUBDIR/sync"

echo "Android library was copied to $PLUGIN_TARGET_SUBDIR"

# cd $CURRENT_DIR
