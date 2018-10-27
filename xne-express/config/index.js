var NODE_ENV = process.env.NODE_ENV;

var config;
if (NODE_ENV) {
    try {
        config = require('./config.' + NODE_ENV + '.json');
    } catch (e) {
        console.log(e);
    }
}
if (!config) {
    config = require('./config.json');
}

module.exports = config;