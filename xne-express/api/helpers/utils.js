/**
 * create by maple
 */

var CustomError = require('xne-framework/vessel/utils/customError')
var appConfig = require('../../config')

/**
 *
 * @param {*} req
 * @param {*} res
 */
function errorHandle(res, e) {
    if (!(e instanceof CustomError)) {
        e = new CustomError('999', e.message ? e.message : e)
    }
    return res.status(500).json(e.toJSON())
}
module.exports = {
    errorHandle: errorHandle
}