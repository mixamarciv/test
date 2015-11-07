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
g.koa_sendfile = require('koa-sendfile');

g.functions = require('../fnc/functions.js');
//g.check_net_disk = require('./fnc/check_net_disk.js');

g.config = require('./config.js');  //загрузка основной конфигурации для всех сайтов

var site_config_file = g.config.args.site_config_file;

if (site_config_file) {
    site_config_file = g.path.join(__dirname,site_config_file);
    g.fs.exists(site_config_file,function(ex){
        if (!ex) return console.error('ERROR: file site_config_file="'+site_config_file+'" not found!');
        console.log('load site_config_file: '+site_config_file);
        require(site_config_file);
    });
}



