'use strict';
//var inc_path = '../../app_template3/inc.js';
var inc_path = global.app_includes.app_inc;
console.log('load '+inc_path);

var g = require(inc_path);
module.exports = g;

g.db_fncs = require('./js/db_fncs.js');


//module.exports = global.g;


