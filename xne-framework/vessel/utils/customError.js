/**
 * Created by maple
 */

var dict = require('./dict');
var ws = require('winston');

/**
 *
 * @param code - Integer
 * @param message - String
 * @constructor
 */
function CustomError(code, message) {
    this.bizCode = dict.data.biz.code;
    this.code = code;
    this.message = message;
};

/**
 *
 * @returns {*}
 */
CustomError.prototype.toString = function() {
    try {
        if (this.message) {
            return this.message;
        }
        var intCode = parseInt(this.code);
        var msg = dict.data.biz.errors[intCode];
        if (!msg) {
            for (var i in dict.data.biz.errors) {
                if (i == intCode) {
                    msg = dict.data.biz.errors[i];
                    break;
                }
            }
        }
        return msg || "UNKNOWN";
    } catch (e) {
        return "UNKNOWN";
    }
};


/**
 *
 * @returns {{error: {code: *, message: *}}}
 */
CustomError.prototype.toJSON = function() {
    var body = {
        code: combineCode(this.bizCode, this.code),
        message: this.message ? this.message : this.toString()
    };
    body.message = body.message || "UNKNOWN";

    return { 'error': body };
};


/**
 *
 * @param code
 */
function combineCode(bizCode, code) {
    try {
        if (code < 0) {
            return code;
        }
        var strCode = bizCode.toString() + code;
        return -parseInt(strCode);
    } catch (e) {
        ws.log('error', `获取错误代码出错: ${e.message}`);
        return -1;
    }
};

module.exports = CustomError;