'use strict';
console.log('load config ...');

//объявляем параметры приложения
var g = require('./inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;

var c = module.exports = g.config;

//аргументы запуска приложения

c.main_app_name = 'webserver';
c.app_path      = path_norm(__dirname);                           //путь к приложению
c.scripts_path  = path_join(c.app_path,'scripts');                //пути к пользовательским скриптам
c.files_path    = path_join(c.app_path,'files');                  //пути к клиентским файлам
c.temp_path     = path_join(c.temp_path,c.main_app_name);         //пути к временным файлам (файлы которые пере/создаются при перезапуске приложения)
c.app_ssl_keys_path = path_join(c.app_path,'keys');               //пути к ключам сертификатов ssl

c.client_lib_path = path_join(c.main_app_path,'client_lib');      //путь к клиентским библиотекам (js,css)

//названия логов:
c.log_path  = path_join(c.temp_path,'log/'+datef('Y.M'));


c.db = {};

//текущий ip адрес машинки(первый, если их несколько)
c.ip = g.mixa.ip.get_ipv4_adress_list(/192\.168\.\d\./)[0];

//будем ли использовать koa-helmet для безопасности
c.use_secure = 1;

//задаем http и https порты:
c.port_http = c.args.port_http;
c.port_https = c.args.port_https;


if(!c.port_http ) c.port_http = 80;
if(!c.port_https) c.port_https = 443;


c.templates = {};          //набор параметров и данных по шаблонам
c.templates.main_path = undefined;  //пути к шаблонам eсt (задаются в config_site.js)
c.templates.watch = true;  // ect — Automatic reloading of changed templates, defaulting to false
c.templates.cache = true;  // ect — Compiled functions are cached, defaulting to true

//==================================================================================
//далее данные которые будут загружены автоматически при старте приложения:
c.auto = {};

//==================================================================================
//webserver:
c.auto.use_https = 0;        //запускаем https сервер вместе с http
c.auto.templates = {};       //данные шаблонов
c.auto.templates.path  = {}; //список доступных шаблонов в виде: {'default':'/path/to/default','name':'/path/to/name'}
c.auto.templates.names = []; //список имен доступных шаблонов

c.auto.menu = {};            //пункты меню, - загружаются автоматически из scripts_path файлов 
//==================================================================================
c.debug = {};
c.debug.load_user_data_from_cookies = 1;  //выводить ошибки модуля load_user_data_from_cookies.js
