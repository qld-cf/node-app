'use strict';
/**
 * Created by maple
 */
'use strict';

var debug = require('debug')('xne-express');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var cors = require('cors');
var path = require('path');
var appConfig = require('./config');
var config = {
    appRoot: __dirname
};



/**
 * 初始化字典文件
 */
var dictFile = path.join(__dirname, './config/dict.json');
debug(`loading ${dictFile}`);
var dict = require('xne-framework/vessel/utils/dict');
dict.init(dictFile);

/**
 * 初始化数据库
 */
var db = require('xne-db/db');
// db.init(appConfig.mongo, dbCallback);
db.init(appConfig.mongo);
// db.init(appConfig.mongo, appConfig.cache);  //TODO  有用到redis再开启调试



/**
 * support CORS
 */
app.use(cors());

/**
 * swagger edit
 */
SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    app.use(SwaggerUi(swaggerExpress.runner.swagger, {
        // apiDocs: '/api-docs',
        swaggerUi: '/api-docs/'
    }));
    // install middleware
    swaggerExpress.register(app);

    var port = process.env.PORT || 3000;
    app.listen(port);

    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log('\ntry this for swagger api docs:\ncurl http://127.0.0.1:' + port + '/api-docs/');
        console.log('\ntry this for api test:\ncurl http://127.0.0.1:' + port + '/api/search/test');
    }
});

module.exports = app;