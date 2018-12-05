function getScriptsDictionary(json) {
    return getDictionary(json["scripts"]);

}

function getDevDepsDictionary(json) {
    return getDictionary(json["devDependencies"]);
}

function getDescriptionsDictionary(json) {
    return getDictionary(json["descriptions"]);
}

function getCategoriesDictionary(json) {
    return getDictionary(json["categories"]);
}

function getDictionary(json) {
    var result = [];
    for (var i in json) {
        result.push({ key: i, value: json[i] });
    }

    return result;
}

module.exports.getScriptsDictionary = getScriptsDictionary;
module.exports.getDevDepsDictionary = getDevDepsDictionary;
module.exports.getDescriptionsDictionary = getDescriptionsDictionary;
module.exports.getCategoriesDictionary = getCategoriesDictionary;
