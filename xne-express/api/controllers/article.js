/*
 * @Description: In User Settings Edit
 * @Author: mapleChain
 * @Date: 2019-05-23 17:16:24
 * @LastEditTime: 2019-06-12 11:27:11
 * @LastEditor: mapleChain
 */
/**
 * Created by maple
 */

var appConfig = require('../../config')
var ws = require('xne-framework/vessel/logger/index')(appConfig.logConfig);
var utils = require('../helpers/utils')
var Article = require('xne-db/mongo/Article')
var CustomError = require('xne-framework/vessel/utils/customError')


module.exports = {
    getArticleInfo: getArticleInfo,
}


/**
 * @description: mongo - 查询实例
 * @param {type} id: 文章编号
 * @return: 文章明细
 */
function getArticleInfo(req, res) {
    try {
        var id = req.swagger.params.id.value;
        Article.find({
                articleId: id
            }, ).then(result => {
                return res.json({ data: result });
            }).catch((err) => {
                throw new CustomError("999", err.message ? err.message : err)
            })
    } catch (e) {
        ws.log('ERROR', `QUERY_ARTICLE_ERROR ${e}`)
        utils.errorHandle(res, e);
    }
}

