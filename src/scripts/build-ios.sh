set -e
set -o pipefail

BUILD_FLAVOR="Release"

while getopts b:t:n:d: option
do
    case "${option}"
        in
    b) BUILD_FLAVOR=${OPTARG};;
    t) PLUGIN_TARGET_DIR=${OPTARG};;
    n) IOS_SOURCE_DIR=${OPTARG};;
    d) DEVICE_FLAVOR=${OPTARG};;
    esac
done

if [ -z "$DEVICE_FLAVOR" ] && [ $BUILD_FLAVOR = "Debug" ]
then
    DEVICE_FLAVOR="Fat"  
fi

XCODE_PROJ_DIR=`find $IOS_SOURCE_DIR -name "*.xcodeproj" -print`
PROJ_NAME_EXTENTION=$(basename $XCODE_PROJ_DIR)
SOURCE_NAME="${PROJ_NAME_EXTENTION%.*}"

PROJECT_NAME="$SOURCE_NAME.xcodeproj"
TARGET_NAME="$SOURCE_NAME"
FRAMEWORK_NAME="$SOURCE_NAME"
FRAMEWORK_FILE=$FRAMEWORK_NAME.framework
FRAMEWORK_DSYM_FILE=$FRAMEWORK_NAME.framework.dSYM

BUILD_DIR="$IOS_SOURCE_DIR/build/intermediates/${FRAMEWORK_NAME}"
BUILD_FOR_SIMULATOR_DIR="$BUILD_DIR/$FLAVOR-iphonesimulator"
BUILD_OUTPUT_DIR="$IOS_SOURCE_DIR/build/outputs"
HAS_DSYM="yes"  

PLUGIN_TARGET_SUBDIR="$PLUGIN_TARGET_DIR/ios"

OUTPUT_FRAMEWORK_FILE_DIR=$PLUGIN_TARGET_SUBDIR/$FRAMEWORK_FILE
OUTPUT_FRAMEWORK_DSYM_FILE_DIR=$PLUGIN_TARGET_SUBDIR/$FRAMEWORK_DSYM_FILE

cd $IOS_SOURCE_DIR

if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi

echo "Build for iphonesimulator in" $BUILD_FLAVOR "configuration"
xcodebuild -project $PROJECT_NAME -scheme $TARGET_NAME \
    -configuration "$BUILD_FLAVOR" \
    -sdk iphonesimulator \
    GCC_PREPROCESSOR_DEFINITIONS='$GCC_PREPROCESSOR_DEFINITIONS ' \
    CONFIGURATION_BUILD_DIR=$BUILD_FOR_SIMULATOR_DIR \
    clean build -quiet

echo "Build for iphoneos in" $BUILD_FLAVOR "configuration"
xcodebuild -project $PROJECT_NAME -scheme $TARGET_NAME \
    -configuration "$BUILD_FLAVOR" \
    -sdk iphoneos \
    GCC_PREPROCESSOR_DEFINITIONS='$GCC_PREPROCESSOR_DEFINITIONS ' \
    clean build archive -quiet

DEVICE_DIR="$(xcodebuild -project $PROJECT_NAME -scheme $TARGET_NAME -configuration $BUILD_FLAVOR \
    -showBuildSettings | grep CONFIGURATION_BUILD_DIR | sed 's/.*= //')"

if [ -d "$BUILD_OUTPUT_DIR/$FRAMEWORK_FILE" ]; then
    echo "Cleaning $BUILD_OUTPUT_DIR/$FRAMEWORK_FILE"
    rm -rf "$BUILD_OUTPUT_DIR/$FRAMEWORK_FILE"
fi

if [ -d "$BUILD_OUTPUT_DIR/$FRAMEWORK_DSYM_FILE" ]; then
    echo "Cleaning $BUILD_OUTPUT_DIR/$FRAMEWORK_DSYM_FILE"
    rm -rf "$BUILD_OUTPUT_DIR/$FRAMEWORK_DSYM_FILE"
fi

mkdir -p "$BUILD_OUTPUT_DIR/$FRAMEWORK_FILE"

cp -fr "$DEVICE_DIR/$FRAMEWORK_FILE" "$BUILD_OUTPUT_DIR"

if [ "$DEVICE_FLAVOR" = "Simulator" ]; then
    echo "Debug info enabled: Coping dSYM for Simulator"
    cp -fr "$BUILD_FOR_SIMULATOR_DIR/$FRAMEWORK_DSYM_FILE" "$BUILD_OUTPUT_DIR"
elif [ "$DEVICE_FLAVOR" = "Device" ]; then
    echo "Debug info enabled: Coping dSYM for Device"
    cp -fr "$DEVICE_DIR/$FRAMEWORK_DSYM_FILE" "$BUILD_OUTPUT_DIR"
else
    HAS_DSYM="no"
    echo "Debug info disabled: Cannot copy dSYM for 'fat framework', please specify second arg (Simulator/Device)"
fi

echo "Build fat framework"
xcrun -sdk iphoneos lipo -create \
    $BUILD_FOR_SIMULATOR_DIR/$FRAMEWORK_FILE/$FRAMEWORK_NAME \
    $DEVICE_DIR/$FRAMEWORK_FILE/$FRAMEWORK_NAME \
-o "$BUILD_OUTPUT_DIR/$FRAMEWORK_FILE/$FRAMEWORK_NAME"

rm -rf $BUILD_DIR

echo "$FRAMEWORK_FILE was built in $BUILD_OUTPUT_DIR"

if [ ! -d $PLUGIN_TARGET_DIR ]; then
    mkdir $PLUGIN_TARGET_DIR
fi

if [ ! -d $PLUGIN_TARGET_SUBDIR ]; then
    mkdir $PLUGIN_TARGET_SUBDIR
fi

if [ -e $OUTPUT_FRAMEWORK_FILE_DIR ]; then
    rm -rf $OUTPUT_FRAMEWORK_FILE_DIR
fi

if [ -e $OUTPUT_FRAMEWORK_DSYM_FILE_DIR ]; then
    rm -rf $OUTPUT_FRAMEWORK_DSYM_FILE_DIR
fi

cp -R "$BUILD_OUTPUT_DIR/$FRAMEWORK_FILE" $PLUGIN_TARGET_SUBDIR
echo "iOS $FRAMEWORK_FILE was copied to $PLUGIN_TARGET_SUBDIR"
if [ $HAS_DSYM = "yes" ]
then
    cp -R "$BUILD_OUTPUT_DIR/$FRAMEWORK_DSYM_FILE" $PLUGIN_TARGET_SUBDIR 
    echo "iOS $FRAMEWORK_DSYM_FILE was copied to $PLUGIN_TARGET_SUBDIR"
fi