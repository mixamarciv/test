'use strict';
console.log('load config ...');

//объявляем параметры приложения
var g = require('./inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;

var c = module.exports = g.config;

//аргументы запуска приложения
c.args = require('minimist')(process.argv.slice(2));

c.app_name      = 'webserver';
c.app_path      = path_norm(__dirname);                           //путь к приложению
c.scripts_path  = path_join(c.app_path,'scripts');                //пути к пользовательским скриптам
c.files_path    = path_join(c.app_path,'files');                  //пути к клиентским файлам
c.temp_path     = path_join(c.temp_path,c.app_name);              //пути к временным файлам (файлы которые пере/создаются при перезапуске приложения)
c.app_ssl_keys_path = path_join(c.app_path,'keys');               //пути к ключам сертификатов ssl

c.client_lib_path = path_join(c.app_path,'client/lib');            //путь к клиентским библиотекам (js,css)

//названия логов:
c.log_path  = path_join(c.temp_path,'log/'+datef('Y.M'));


c.db = {};

c.db['webserver'] = {
    dbtype: 'ibase',
    database: path_join(c.app_path,'db/app.fdb'),
    host: '127.0.0.1',
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey', // default
    role: null,            // default
    pageSize: 4096,        // default when creating database
    cp: 'win1251',
    table_prefix: "t_"
};


c.db['taskqueue'] = {
    dbtype: 'ibase',
    database: path_join(c.app_path,'app/taskqueue/db/task.fdb'),
    host: '127.0.0.1',
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey', // default
    role: null,            // default
    pageSize: 4096,        // default when creating database
    cp: 'win1251',
    table_prefix: "t_"
};


c.db['0002.fdb'] = {
    dbtype: 'firebird',
    database: 'D:/_db_web/db002/0002.fdb',
    host: '192.168.1.7',
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey', // default
    role: null,            // default
    pageSize: 4096,        // default when creating database
    cp: 'win1251',
    table_prefix: ""
};


//текущий ip адрес машинки(первый, если их несколько)
c.ip = g.mixa.ip.get_ipv4_adress_list(/192\.168\.\d\./)[0];


c.templates = {};          //набор параметров и данных по шаблонам
c.templates.main_path = path_join(c.app_path,'client/templates/');  //пути к шаблонам eсt
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
