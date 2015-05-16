'use strict';
console.log('load inc ...');
//объявляем все глобальные переменные которые используются практически во всех модулях

var g = require('../../main_inc.js');

global.app_includes.inc = __filename;
global.app_includes.app_inc = __filename;


module.exports = g;


g.co = require('co');
g.thunkify = require('thunkify');
g.koa_send = require('koa-send');


g.functions = require('../fnc/functions.js');
//g.check_net_disk = require('./fnc/check_net_disk.js');

g.config = require('./config.js');  //загрузка основной конфигурации для всех сайтов

if (g.config.args.site_config_file) {
    g.config = require(g.config.args.site_config_file);  //путь к конфигам отдельного сайта
}



