const winston = require('../../node_modules/winston');
var moment = require('../../node_modules/moment/moment');
require('winston-daily-rotate-file');

function winstonServer(logConfig,name) {
    let self = this;
    self.jsFileName = name;
    self.maxFiles = logConfig.maxFiles || "14d" ;
    self.maxsize = logConfig.maxsize || "500m";//500m
    self.filePath = logConfig.filePath || "../logs/";
    self.serviceName = logConfig.serviceName || "picasso-server";
    self.zippedArchive = logConfig.zippedArchive || false ;
    self.initWinston();
}
const tsFormat = () => moment().format('YYYY-MM-DD HH:mm:ss');

winstonServer.prototype.initWinston = function () {
    let self = this;
    const serviceTransportFile = (level) => {
        var filename = self.serviceName + "_"+level+"_%DATE%.log";
        return new (winston.transports.DailyRotateFile)({
            filename: filename,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: self.zippedArchive,
            maxSize: self.maxsize,
            dirname: self.filePath,
            timestamp: tsFormat,
            maxFiles: self.maxFiles
        });
    };

    var error_filename = self.serviceName + "_error-%DATE%.log";
    winston.loggers.add('error', {
        transports: [
            new winston.transports.Console({
                json: false,
                colorize: true,
                showLevel: false,
                timestamp: tsFormat,
                label: 'error'
            }),
            serviceTransportFile('error')
        ],
    });

    var info_filename = self.serviceName + "_info-%DATE%.log";
    winston.loggers.add('info', {
        transports: [
            new winston.transports.Console({
                json: false,
                colorize: true,
                showLevel: false,
                timestamp: tsFormat,
                label: 'info'
            }),
            serviceTransportFile('info')
        ],
    });


    var debug_filename = self.serviceName + "_debug-%DATE%.log";
    winston.loggers.add('debug', {
        transports: [
            new winston.transports.Console({
                json: false,
                colorize: true,
                showLevel: false,
                timestamp: tsFormat,
                label: 'debug'
            }),
            serviceTransportFile('debug')
        ],
    });


    var warn_filename = self.serviceName + "_warn-%DATE%.log";
    winston.loggers.add('warn', {
        transports: [
            new winston.transports.Console({
                json: false,
                colorize: true,
                showLevel: false,
                timestamp: tsFormat,
                label: 'warn'
            }),
            serviceTransportFile('warn')
        ],
    });
    winston.loggers.add('kafka', {
        transports: [
            serviceTransportFile('kafka')
        ],
    });

    self.errorLog = winston.loggers.get('error');
    self.infoLog = winston.loggers.get('info');
    self.debugLog = winston.loggers.get('debug');
    self.warnLog = winston.loggers.get('warn');
    self.kafkaLog = winston.loggers.get('kafka');

}

winstonServer.prototype.error = function (args) {
    var self = this;
    return self.errorLog.error(self.jsFileName + " "+ args);
};

winstonServer.prototype.info = function (args) {
    var self = this;
    return self.infoLog.info(self.jsFileName + " "+ args);
};
winstonServer.prototype.debug = function (args) {
    var self = this;
    return self.debugLog.info(self.jsFileName + " "+ args);
};

winstonServer.prototype.warn = function (args) {
    var self = this;
    return self.warnLog.warn(self.jsFileName + " "+ args);
};

winstonServer.prototype.kafka = function (args) {
    var self = this;
    return self.kafkaLog.info(self.jsFileName + " "+ args);
};


winstonServer.prototype.log = function (level, args) {
    var self = this;
    args = self.jsFileName + " "+ args
    if (level === 'error') {
        return self.errorLog.error(args);
    } else if (level === 'info') {
        return self.infoLog.info(args);
    } else if (level === 'debug') {
        return self.debugLog.debug(args);
    } else if (level === 'warn') {
        return self.warnLog.warn(args);
    }
};
module.exports = winstonServer;


