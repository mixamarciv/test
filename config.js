console.log('load config ...');

//объявляем параметры приложения
var c = module.exports = {};

var g = require('inc.js');
var path_join = g.mixa.path.join;
var path_norm = g.mixa.path.norm;
var datef = g.mixa.str.date_format;



c.app_path = path_norm(__dirname);



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


