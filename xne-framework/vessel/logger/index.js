var Winston = require('./winston');
var fs = require('fs');

module.exports = function (loggerConfig, fileName) {
    let _defaultFile = {
        maxFiles: "14d",
        maxsize: "500m",
        filePath: "../logs/",
        serviceName: "picasso-server"
    };

    let opts = loggerConfig || _defaultFile;
    try {
        if (!fs.existsSync(opts.filePath)) {
            fs.mkdirSync(opts.filePath);
        }
    } catch (err) {
        try {
            opts.filePath = _defaultFile.filePath;
            if (!fs.existsSync(opts.filePath)) {
                fs.mkdirSync(opts.filePath);
            }
        } catch (err) {
            opts.filePath = '';
        }
    } finally {
        try {
            if (fileName) {
                var index = fileName.lastIndexOf("/") + 1;
                fileName = "[" + fileName.substring(index) + "]";
                return new Winston(opts, fileName);
            } else {
                return new Winston(opts, "");
            }
        } catch (err) {
            return new Winston(opts, "");
        }
    }
};
