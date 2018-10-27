/**
 * Created by maple
 */

var yaml = require('js-yaml');
var fs = require('fs');
var ws = require('winston');

var dict = {};

/**
 * Load yaml file
 * @param file
 * @returns {*}
 */
function load(file) {
    try {
        var doc = yaml.load(
            fs.readFileSync(file, 'utf8')
        );
        ws.log('debug', doc);
        return doc;
    } catch (e) {
        ws.log('error', e);
    }
};

/**
 *
 * @param app
 * @param options
 * @returns {{}}
 */
dict.init = function(dictFile) {
    if (this.data) {
        throw new Error('already inited');
    }
    if (dictFile.endsWith('.json')) {
        this.data = require(dictFile);
    } else {
        this.data = load(dictFile);
    }

    return dict;
};

/**
 *
 * @param app
 * @param options
 * @returns {{}}
 */
module.exports = dict;