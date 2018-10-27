/**
 * Created by maple
 */

var appConfig = require('../../config')
var ws = require('xne-framework/vessel/logger/index')(appConfig.logConfig);
var utils = require('../helpers/utils')
var Article = require('xne-db/article/Article')
var CustomError = require('xne-framework/vessel/utils/customError')


module.exports = {
    getInfo: getInfo,
}

/**
 * 例子：通用查询
 * @param {keyword}
 */
function getInfo(req, res) {
    try {
        var keyword = req.swagger.params.keyword.value;
        var reg = new RegExp(keyword, 'i') //不区分大小写
        Article.find({
                $or: [ //多条件，数组
                    { title: { $regex: reg } },
                    { content: { $regex: reg } }
                ]
            }, )
            .then(result => {
                return res.json({ data: result });
            })
            .catch((err) => {
                throw new CustomError("999", err.message ? err.message : err)
            })
    } catch (e) {
        ws.log('error', `getInfo_catch_error ${e}`)
        utils.errorHandle(res, e);
    }
}