function getPluginPreDefinedWatchers(demoFolder, demoAngularFolder) {
    const demoPath = demoFolder + "/app";
    const demoAngularPath = demoAngularFolder + "/app";
    return [{
        key: "nd.prepare.demo.angular.app.android",
        patterns: [
            demoAngularPath
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
        key: "nd.prepare.demo.app.android",
        patterns: [
            demoPath
        ],
        extensions: ""
    },
    {
        key: "nd.prepare.demo.app.ios",
        patterns: [
            demoPath
        ],
        extensions: ".ts"
    }];
}

module.exports.getPluginPreDefinedWatchers = getPluginPreDefinedWatchers;