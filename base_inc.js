'use strict';
console.log('load base_inc ...');
//объявляем все глобальные переменные которые используются практически во всех модулях

var g = {}
module.exports = g;


g.data = {};    //список глобальных переменных
g.data.app_start_time = new Date();
g.data.db = {}; //список установленных подключений к бд


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

g.mixa = require('mixa_std_js_functions');
g.db = require('mixa_db_js_functions');

g.path.join2      = g.mixa.path.join;
g.path.norm2      = g.mixa.path.norm;
g.path.normalize2 = g.mixa.path.norm;
g.path.mkdir_path = g.mixa.path.mkdir_path;


g.config = require('./base_config.js');




