/*
 * @Description: In User Settings Edit
 * @Author: mapleChain
 * @Date: 2019-05-23 17:16:24
 * @LastEditTime: 2019-06-12 14:09:10
 * @LastEditor: mapleChain
 */
/**
 * Created by maple
 */

var appConfig = require('../../config')
var ws = require('xne-framework/vessel/logger/index')(appConfig.logConfig);
var { projectService } = require('../service');
var CustomError = require('xne-framework/vessel/utils/customError')




module.exports.getProjectInfo =  (req, res) =>  {
  try {
    var id = req.swagger.params.id.value;
    projectService.getProjects(id).then(result => {
      return res.json({ data: result });
    }).catch(err => {
      throw new CustomError("999", err.message ? err.message : err)
    })
  } catch (e) {
    ws.log('ERROR', `QUERY_ARTICLE_ERROR ${e}`)
    utils.errorHandle(res, e);
  }
};
