'use strict';
console.log('load inc ...');
//объявляем все глобальные переменные которые используются практически во всех модулях

var g = require('../../main_inc.js');
module.exports = g;


g.co = require('co');
g.thunkify = require('thunkify');
g.koa_send = require('koa-send');


g.functions = require('../fnc/functions.js');
//g.check_net_disk = require('./fnc/check_net_disk.js');

g.config = require('./config.js');




