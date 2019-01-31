function getScriptsDictionary(json) {
    return getDictionary(json["scripts"]);
}

function getDescriptionsDictionary(json) {
    return getDictionary(json["descriptions"]);
}

function getCategoriesDictionary(json) {
    return getDictionary(json["categories"]);
}

function getShortCommandsDictionary(json) {
    return getDictionary(json["shortCommands"]);
}

function getWatchersDictionary(json) {
    return getDictionary(json["watch"]);
}

function getDictionary(json) {
    var result = [];
    for (var i in json) {
        result.push({ key: i, value: json[i] });
    }

    return result;
}

module.exports.getScriptsDictionary = getScriptsDictionary;
module.exports.getDescriptionsDictionary = getDescriptionsDictionary;
module.exports.getCategoriesDictionary = getCategoriesDictionary;
module.exports.getShortCommandsDictionary = getShortCommandsDictionary;
module.exports.getWatchersDictionary = getWatchersDictionary;