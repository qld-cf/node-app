
var Redis = require('./redis');
module.exports = function (cacheConfig) {
    var opts = cacheConfig || {};
    var cache=new Redis(opts);
    return cache;
}
