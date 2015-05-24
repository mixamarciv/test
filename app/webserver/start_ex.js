'use strict';
console.log('  load app/webserver/start_ex.js..');

var clog = console.log;

var g = require('./inc.js');
var f = g.functions;
var tf = g.thunkify;

//g.config.stop_server = 1; //флаг остановки вебсервера

//g.config.args.start_ex_script
module.exports = function(fn){
    require(g.config.args.start_ex_script)(fn);
};

    
