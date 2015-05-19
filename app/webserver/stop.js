'use strict';
console.log('  load app/webserver/stop.js..');

var clog = console.log;

var g = require('./inc.js');
var f = g.functions;
var tf = g.thunkify;

g.config.stop_server = 1; //флаг остановки вебсервера

module.exports = function(fn){
    require('kill-prev-app-process')({
            path: g.path.join2(g.config.temp_path,'pid'),   // где храним pid текущего-предыдущего процесса
            wait: 10                                                  // сколько ждем после завершения предыдущего процесса 
    },function(err){
      clog('end');
      if(fn) fn();
    });
}