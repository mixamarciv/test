'use strict';
console.log('load inc ...');

var g = require('../../main_inc.js');
module.exports = g;

g.co = require('co');
g.thunkify = require('thunkify');

g.config = require('./config.js');




