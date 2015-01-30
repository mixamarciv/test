'use strict';
console.log('load inc ...');
//объявляем все глобальные переменные которые используются практически во всех модулях

var g = {}
module.exports = g;

g.os   = require('os');
g.fs   = require('fs');
g.util = require('util');
g.path = require('path');
g.crypto = require('crypto');

g.u    = require('underscore');
g.u.str = require('underscore.string');
g.moment = require('moment');

//g.async = require('async');
g.process_logger = require('process-logger');
g.rimraf = require('rimraf');

g.iconv = require('iconv-lite');
g.iconv.extendNodeEncodings();

//g.ncp  = require('ncp').ncp;

//g.path.mkdirp = require('mkdirp');

g.co = require('co');
g.thunkify = require('thunkify');

g.koa_send = require('koa-send');


g.mixa = require('mixa_std_js_functions');
g.db = require('mixa_db_js_functions');

g.path.join2 = g.mixa.path.join;
g.path.norm2 = g.mixa.path.norm;
g.path.normalize2 = g.mixa.path.norm;



g.functions = require('./app/fnc/functions.js');
//g.check_net_disk = require('./fnc/check_net_disk.js');

g.config = require('./config.js');


g.data = {};    //список глобальных переменных
g.data.db = {}; //список установленных подключений к бд

//g.db_0002fdb = require('./fnc/database_connect.js').create_db_connect(g.config.db0002fdb_options);


