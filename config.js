console.log('load config ...');

//объявляем параметры приложения
var c = module.exports = {};

var g = require('inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;



c.app_path = path_norm(__dirname);                             //путь к приложению
c.scripts_path = path_join(c.app_path,'scripts');              //пути к пользовательским скриптам
c.files_path = path_join(c.app_path,'files');                  //пути к клиентским файлам

c.client_lib_path = path_join(__dirname,'client/lib');         //путь к клиентским библиотекам (js,css)

//названия логов:
c.log_path  = path_join(__dirname,'log/'+datef('Y.M'));


c.db0002fdb_options = {
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

//аргументы запуска приложения
c.args = require('minimist')(process.argv.slice(2));


c.templates = {};          //набор параметров и данных по шаблонам
c.templates.main_path = path_join(c.app_path,'client/templates/');  //пути к шаблонам eсt
c.templates.watch = true;  // ect — Automatic reloading of changed templates, defaulting to false
c.templates.cache = true;  // ect — Compiled functions are cached, defaulting to true

//==================================================================================
//далее данные которые будут загружены автоматически при старте приложения:
c.templates.path  = {}; //список доступных шаблонов в виде: {'default':'/path/to/default','name':'/path/to/name'}
c.templates.names = []; //список имен доступных шаблонов

