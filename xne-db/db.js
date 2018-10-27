/**
 * Created by maple
 */
var debug = require("debug")("xne-db:initdb");
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var db = {}
var cachegoose = require('xne-framework/vessel/mongoose-cache');

/**
 * 初始化数据库
 */
db.init = function(mongoConfig, redisConfig, callback) {
    if (redisConfig) {
        cachegoose(mongoose, redisConfig);
    }
    var uri = mongoConfig.uri;
    if (!uri) {
        uri = "mongodb://" + mongoConfig.hostUrl + "/" + mongoConfig.dbName;
    }
    db.connection = mongoose.createConnection(uri, mongoConfig);
    db.connection.on("error", function(error) {
        debug(error);
        console.log('db error')
        console.log(error)
    });
    callback && callback();
}

module.exports = db;