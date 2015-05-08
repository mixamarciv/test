'use strict';
console.log('load config ...');

//объявляем параметры приложения
var g = require('./inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;

var c = module.exports = g.config;

c.app_name      = 'backupcleaner';
c.app_path      = path_norm(__dirname);                           //путь к приложению
c.temp_path     = path_join(c.temp_path,c.app_name);              //пути к временным файлам (файлы которые пере/создаются при перезапуске приложения)

//пути к логам:
c.log_path  = path_join(c.temp_path,'log/'+datef('Y.M'));

