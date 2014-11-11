console.log('load inc ...');
//объявляем все глобальные переменные которые используются практически во всех модулях

var g = {}
module.exports = g;

g.fs   = require('fs');
g.util = require('util');
g.path = require('path');
g.u    = require('underscore');
g.u.str = require('underscore.string');
//g.async = require('async');
g.process_logger = require('process_logger');
g.rimraf = require('rimraf');

//g.ncp  = require('ncp').ncp;

//g.path.mkdirp = require('mkdirp');

g.co = require('co');
g.thunkify = require('thunkify');
g.koa_send = require('koa-send');


g.mixa = require('mixa_std_js_functions');

g.path.join2 = g.mixa.path.join;
g.path.norm2 = g.mixa.path.norm;
g.path.normalize2 = g.mixa.path.norm;



g.functions = require('./app/fnc/functions.js');
//g.check_net_disk = require('./fnc/check_net_disk.js');

g.config = require('./config.js');

//g.db_0002fdb = require('./fnc/database_connect.js').create_db_connect(g.config.db0002fdb_options);


