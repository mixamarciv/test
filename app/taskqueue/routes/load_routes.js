'use strict';
console.log('  load app/taskqueue/load_routes/load_routes.js..');

var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;
var fnc = {};

module.exports = function *(app){
    var Router = require('koa-router');
    var router = new Router();
    
    router.get('/run', require('./run.js').run());
    router.get('/status', function *(next) {yield next;});
    
    app.use(router.middleware());
}

