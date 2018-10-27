/**
 * Created by maple
 * @param 区块模型
 */

var mongoose = require('mongoose');
var db = require('../db');

var blockSchema = new mongoose.Schema({
    id: { type: String, required: true },
    currentBlock: { type: String, required: true, default: 0 }, //当前所在区块高度
    isTestNet: { type: Boolean }, //是否在测试网络
});


var Block = module.exports = db.connection.model('block', blockSchema);