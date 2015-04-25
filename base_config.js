'use strict';
console.log('load base_config ...');

//объявляем параметры приложения
var c = module.exports = {};

var g = require('./base_inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;

//аргументы запуска приложения
c.args = require('minimist')(process.argv.slice(2));

//c.app_name = 'webc4';
c.app_path       = path_norm(__dirname);                              //путь к приложению

c.temp_path      = path_join(c.app_path,'temp');                      //пути к временным файлам (файлы которые пере/создаются при перезапуске приложения)
c.main_temp_path = c.temp_path;
//c.client_lib_path = path_join(__dirname,'client/lib');         //путь к клиентским библиотекам (js,css)

c.db = {};

//текущий ip адрес машинки(первый, если их несколько)
c.ip = g.mixa.ip.get_ipv4_adress_list(/192\.168\.\d\./)[0];

//==================================================================================
//далее данные которые будут загружены автоматически при старте приложения:
c.auto = {};

