function getScriptsDictionary(scripts) {
    var result = [];
    var scripts = scripts["scripts"];
    for (var i in scripts) {
        result.push({ key: i, value: scripts[i] });
    }

    return result;
}

function getDevDepsDictionary(scripts) {
    var result = [];
    for (var i in scripts["devDependencies"]) {
        result.push({ key: i, value: scripts[i] });
    }

    return result;
}

function getDescriptionsDictionary(scripts) {
    var result = [];
    for (var i in scripts["descriptions"]) {
        result.push({ key: i, value: scripts[i] });
    }

    return result;
}

module.exports.getScriptsDictionary = getScriptsDictionary;
module.exports.getDevDepsDictionary = getDevDepsDictionary;
module.exports.getDescriptionsDictionary = getDescriptionsDictionary;
