'use strict';

var debug = require("debug")("xne-db:initdb");
const config = require('../config').mysql;
const Sequelize = require('sequelize');
const operatorsAliases = require('./operators_aliases');

config.orm.operatorsAliases = operatorsAliases;
let pool = new Sequelize(config.database, config.user, config.password, config.orm);

pool.authenticate()
    .then(() => {
        debug('DB Connection has been established successfully')
        console.log('DB Connection has been established successfully');
    })
    .catch(err => {
        debug('Unable to connect to the database', err)
        console.error('Unable to connect to the database', err);
    });

module.exports = {
    pool,
    Sequelize,
};