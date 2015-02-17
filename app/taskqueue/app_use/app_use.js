'use strict';
console.log('  load app/taskqueue/app_use/app_use.js..');

var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;

module.exports = function load_app_use(app){
    //задаем локальные переменные и время старта загрузки контента
    app.use(initialize);
    
    //logger
    app.use(require('koa-logger')());
    
    //разбор параметров
    app.use(require('koa-bodyparser')());
    
}

function* initialize(next) {
    //this.locvars - переменные доступные во время обработки запроса.
    this.locvars = {};
    this.locvars.start_load = new Date;
    
    
    try {
        yield next;
    } catch(e) {
        this.status = 500;
        var dump_error = 'ERROR:\n'+g.mixa.dump.var_dump_node('error',f.merr(e),{max_str_length:10000});
        
        this.body = dump_error;
        clog(dump_error);
        //this.body = g.mixa.dump.var_dump_node(e);
    }
    
    //yield next;
}
