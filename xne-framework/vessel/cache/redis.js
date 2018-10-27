var Redis = require("ioredis");
var util = require('util');
var debug = require('debug')('xne-framework:vessel:cache:redis');

function RedisCache(cacheConfig) {
    var self = this;
    // var client;
    // if (appConfig.redisCluster) {
    //     client = new Redis.Cluster(appConfig.redisCluster, {
    //         replication: true,
    //         scaleReads: "all"
    //     });
    // } else {
    //     client = new Redis(appConfig.redis);
    // }
    var client = null;
    if (cacheConfig.sentinels && Array.isArray(cacheConfig.sentinels)) {
        debug("init Redis ");
        client = new Redis(cacheConfig);
    } else if (Array.isArray(cacheConfig.server)) {
        debug("init Redis.Cluster ");
        client = new Redis.Cluster(cacheConfig.server, cacheConfig.options || {
            replication: true,
            scaleReads: "all"
        });
    } else {
        var opt = cacheConfig.options || {};
        opt.connectTimeout = 10000;
        client = new Redis(cacheConfig.server, opt);
    }
    self.client = client;
}

RedisCache.prototype.getClient = function() {
    var self = this;
    return self.client;
}

RedisCache.prototype.queryWithCache = function(key, queryPromise, exSecond) {
    if (!key) {
        throw new Error('key can not be null');
    }
    if (!queryPromise) {
        throw new Error('queryPromise can not be null');
    }
    var self = this;
    var needCache = false;
    return self.get(key).then(function(cacheData) {
        if (cacheData) {
            try {
                return JSON.parse(cacheData);
            } catch (e) {
                return cacheData;
            }
        } else {
            needCache = true;
            return queryPromise();
        }
    }).then(function(result) {
        if (needCache) {
            var cacheData = result;
            if (typeof cacheData != 'string') {
                cacheData = JSON.stringify(cacheData);
            }
            var setPromise;
            if (exSecond) {
                setPromise = self.set(key, cacheData, "ex", exSecond);
            } else {
                setPromise = self.set(key, cacheData);
            }
            setPromise.then(function(cacheResult) {
                debug("set cache success:" + key);
            }).catch(function(err) {
                debug("set cache error");
                debug(err);
            })
        }
        return result;
    })
}


RedisCache.prototype.set = function(key, value, ex = 'ex', ttl = 7 * 24 * 60 * 60) {
    var self = this;
    return self.client.set.call(self.client, key, value, ex, ttl);

    //return self.client.set.apply(this, arguments，'ex',7 * 24 * 60 * 60 ); //这样有问题
}

RedisCache.prototype.get = function() {
    var self = this;

    return self.client.get.call(self.client, arguments);
}

RedisCache.prototype.keys = function() {
    var self = this;
    return self.client.keys.call(self.client, arguments);
}

RedisCache.prototype.del = function() {
    var self = this;
    return self.client.del.call(self.client, arguments);
}

RedisCache.prototype.on = function() {
    var self = this;
    return self.client.on.call(self.client, arguments);
}

module.exports = RedisCache;