'use strict';

const generateKey = require('./generate-key');
const HALFHOUR = 60 * 30;
const DAY = 60 * 60 * 24;

module.exports = function (mongoose, cache) {

    mongoose.Query.prototype.cache = function (ttl = HALFHOUR, customKey = '', isLatest = false) {
        debugger ;

        if (typeof ttl === 'number') {
            if (typeof customKey === 'boolean') {
                isLatest = customKey;
                customKey = '';
            }
        } else if (typeof ttl === 'string') {
            if (typeof customKey === 'boolean') {
                isLatest = customKey;
                customKey = ttl;
                ttl = HALFHOUR;
            } else {
                customKey = ttl;
                ttl = HALFHOUR;
            }
        } else if (typeof ttl === 'boolean') {
            isLatest = ttl;
            ttl = HALFHOUR;
            customKey = '';
        }

        this._ttl = ttl;
        this.isLatest = isLatest;
        this._key = customKey;
        const exec = mongoose.Query.prototype.exec;
        const modelName = (this.model.modelName).toLowerCase();
        const option = this.op;
        const key = this._key || `${modelName}.${option}:${this.getCacheKey()}`;
        const mongooseConditions = {
            skip: this.options.skip,
            limit: this.options.limit,
            sort: this.options.sort,
            _conditions: this._conditions,
            _fields: this._fields
        };

        return new Promise((resolve, reject) => {
            let model = new this.constructor({},{},this.model,this.mongooseCollection);
            let newModel = new this.constructor({},{},this.model,this.mongooseCollection);

            if (option === 'update') {
                _updateCache(modelName, cache, model, mongooseConditions).then((idArray) => {
                    return exec.call(this).then(async results => {
                        _findFromMongoAndSaveToCache(modelName, cache, newModel, idArray);
                        return resolve(results);
                    });
                },reject);
            } else if (option === 'remove') {
                _deleteCache(modelName, cache, key, model, mongooseConditions).then(() => {
                    return exec.call(this).then(results => {
                        return resolve(results);
                    });
                },reject);
            } else if (option === 'find' || option === 'findOne') {
                _getCache(modelName, cache, key, this.isLatest).then(async (cachedResults) => {
                    try {
                        if (cachedResults && cachedResults.dataArray && cachedResults.dataArray.length > 0) {
                            for (let item in cachedResults.dataArray) {
                                cachedResults.dataArray[item] = cachedResults.dataArray[item].data;
                            }
                            //如果不是最新数据，进行以下操作：
                            //1.await 把latest设置为 true
                            //2. 异步执行更新操作，从数据库里查找并更新进入cache
                            if (!JSON.parse(cachedResults.indexData).latest) {
                                let newIndexData = JSON.parse(cachedResults.indexData);
                                newIndexData.latest = true;
                                await cache.set(key, JSON.stringify(newIndexData), 'ex', HALFHOUR);

                                //不需要同步执行，可以异步执行：
                                let results = await exec.call(this);
                                if (option === 'findOne') results = [results];
                                _setCache(modelName, cache, key, results, ttl);
                            }
                            let returnData = (option === 'findOne') ? cachedResults.dataArray[0] : cachedResults.dataArray;
                            return resolve(returnData);
                        }
                        else {
                            return exec.call(this).then(results => {
                                if (!results) return resolve();
                                let saveResults = [];
                                if (option === 'findOne') {
                                    saveResults = [results];
                                } else {
                                    saveResults = results;
                                }
                                _setCache(modelName, cache, key, saveResults, ttl).then(() => {
                                    return resolve(results);
                                });
                            });
                        }
                    } catch (e) {
                        throw e;
                    }
                }).catch(err => {
                    return reject(err);
                });
            }
        });
    };

    mongoose.Query.prototype.getCacheKey = function () {
        const key = {
            model: this.model.modelName,
            op: this.op,
            skip: this.options.skip,
            limit: this.options.limit,
            sort: this.options.sort,
            _options: this._mongooseOptions,
            _conditions: this._conditions,
            _fields: this._fields,//过滤条件，可以考虑key的值去掉这个条件
            _path: this._path,
            _distinct: this._distinct,
            _update: this._update
        };
        return generateKey(key);
    };

    mongoose.Model.refreshCache = function (query) {

        let mongooseConditions = {
            _conditions: query
        };

        const modelName = (this.modelName).toLowerCase();

        return new Promise((resolve, reject) => {
            _updateCache(modelName, cache, this, mongooseConditions)
                .then((idArray) => {
                    try {
                        _findFromMongoAndSaveToCache(modelName, cache, this, idArray);
                        return resolve(null);
                    } catch (err) {
                        throw err;
                    }
                }).catch(err => {
                    return reject(err)
            });
        });
    };
};

async function _getCache(modelName, cache, key, isLatest) {
    try {
        if (isLatest) {
            return null;
        } else {
            const results_json = await cache.get(key);
            const data = [];
            if (results_json && results_json.length > 0) {
                const results = JSON.parse(results_json);
                const arr = (results && results.data) || [];
                data.push(...(await Promise.all(arr.map(item => cache.get(modelName + '._id:' + item)))).map(JSON.parse));
                // data.push(...await Promise.all(arr.map(cache.get.bind(cache))));
            }
            //if each ===hull;
            // maybe the value of  < modelName + '._id:' + item >  has been deleted;
            // should return null
            for(let each of data){
                if(each === null) return;
            }
            let result = {
                dataArray: data || [],
                indexData: results_json || ''
            };
            return result;
        }
    }catch (err){
        throw err
    }
}

async function _setCache(modelName, cache, key, values, ttl = HALFHOUR) {

    let indexDate = {
        data: [],
        latest: true
    };
    let dataDate = {
        data: '',
        keys: []
    };
    let newKeysArray = [];
    //存储每个索引下的值
    for (let item of values) {
        indexDate.data.push(item._id.toString());
        dataDate.data = item; //存储每个_id的data值
        newKeysArray.push(key); //存储每个_id的keys值
        let results = await cache.get(modelName + '._id:' + item._id.toString());//查找_id 在cache中的值
        if (results && JSON.parse(results).keys.length >= 0) {//查找_id 在cache中的值，如果已经有了keys,则合并keys并且更新
            if (JSON.parse(results).keys.indexOf(key) === -1) {
                newKeysArray = JSON.parse(results).keys;
                newKeysArray.push(key);
            }else{
                newKeysArray = JSON.parse(results).keys
            }
        }
        dataDate.keys = newKeysArray;
        await cache.set(modelName + '._id:' + item._id.toString(), JSON.stringify(dataDate), 'ex', DAY)
    }
    //存储所有的索引
    return cache.set(key, JSON.stringify(indexDate), 'ex', ttl);
}

/**
 *
 * 分为两种情况{1，update   2.save}
 * .update(已经实现）
 * .save(未实现）
 */
async function _updateCache(modelName, cache, model, mongooseConditions) {

    try {
        let idArray = [];
        const results = await  model.find(mongooseConditions._conditions)
            .skip(mongooseConditions.skip)
            .limit(mongooseConditions.limit)
            .sort(mongooseConditions.sort)
            .exec();
        for (let item of results) {

            let itemDate = JSON.parse(await cache.get(modelName+'._id:'+item._id.toString()));
            if (itemDate && itemDate.keys) {
                for (let each of itemDate.keys) {
                    let eachDate = JSON.parse(await cache.get(each));
                    if(eachDate &&eachDate.latest) eachDate.latest = false;
                    await cache.set(each, JSON.stringify(eachDate), 'ex', HALFHOUR);
                }
            }
            idArray.push(item._id.toString());
        }
        return idArray

    }catch(e) {
        throw e;
    }
}

//仅更新key和(mongodb)Id的可以用; (Mongodb)Id很少实用
async function _deleteCache(modelName, cache, key, model, mongooseConditions) {
    try {
        const results = await  model.find(mongooseConditions._conditions)
            .skip(mongooseConditions.skip)
            .limit(mongooseConditions.limit)
            .sort(mongooseConditions.sort)
            .exec();
        for (let item of results) {

            let itemDate = JSON.parse(await cache.get(modelName+ '._id:'+ item._id.toString()));

            if (itemDate && itemDate.keys) {
                for (let each of itemDate.keys) {
                    let eachDate = JSON.parse(await cache.get(each));
                    eachDate.data.splice(eachDate.data.indexOf(item._id.toString()), 1);
                    eachDate.lastest = false;
                    await cache.set(each, JSON.stringify(eachDate), 'ex', HALFHOUR);
                }
            }
            await cache.del(modelName+ '._id:'+item._id.toString());
        }
        await cache.del(key);
    } catch(e){
        throw e;
        // return Promise.reject(e);
    }
    finally {
        // return ;
        //
        //***注意：不要return ,finally 中的return 级别最高，会覆盖 throw e!!!!!
        //!!!!!!!!!!!
    }
}

function _findFromMongoAndSaveToCache(modelName, cache, model, idArray){
    try {
        return Promise.all(idArray.map(async item => {
            let results = await model.findOne({_id:item});
            if(results && results._doc) {
                results._doc._id = results._doc._id.toString();
                let oldCacheDate = await cache.get(modelName + '._id:' + item);
                let newCacheDate = JSON.parse(oldCacheDate);
                newCacheDate.data = results._doc;
                cache.set(modelName + '._id:' + item, JSON.stringify(newCacheDate), 'ex', DAY);
            }
        }))
    }catch(e){
        throw e;
    }
}