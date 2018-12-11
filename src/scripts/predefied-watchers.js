function getPluginPreDefinedWatchers(demoFolder, demoAngularFolder, iosSourceFolder, androidSourceFolder, iosLibraryName, androidLibraryName) {
    const demoPath = demoFolder + "/app";
    const demoAngularPath = demoAngularFolder + "/app";
    const iosSourcePath = iosSourceFolder + "/" + iosLibraryName;
    const androidSourcePath = androidSourceFolder + "/" + androidLibraryName;
    const androidSourceBuildFolder = androidSourcePath + "/build";
    return [
        {
            key: "nd.prepare.demo.app.android",
            patterns: [
                demoPath
            ],
            extensions: ".ts"
        }, , {
            key: "nd.prepare.demo.angular.app.android",
            patterns: [
                demoAngularPath
            ],
            extensions: ".ts"
        },
        {
            key: "nd.prepare.demo.app.ios",
            patterns: [
                demoPath
            ],
            extensions: ".ts"
        },
        {
            key: "nd.prepare.demo.angular.app.ios",
            patterns: [
                demoAngularPath
            ],
            extensions: ".ts"
        },
        {
            key: "nd.run.demo.app.android",
            patterns: [
                androidSourcePath
            ],
            ignore: androidSourceBuildFolder,
            extensions: "java"
        },
        {
            key: "nd.run.demo.angular.app.android",
            patterns: [
                androidSourcePath
            ],
            ignore: androidSourceBuildFolder,
            extensions: "java"
        },
        {
            key: "nd.run.demo.app.ios",
            patterns: [
                iosSourcePath
            ],
            extensions: "h,m"
        },
        {
            key: "nd.run.demo.angular.app.ios",
            patterns: [
                iosSourcePath
            ],
            extensions: "h,m"
        },];
}

module.exports.getPluginPreDefinedWatchers = getPluginPreDefinedWatchers;