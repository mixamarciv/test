'use strict';
console.log('  load app/webserver/app_use/app_use.js..');

var g = require('../inc.js');
var f = g.functions;
var clog = console.log;

module.exports = function load_app_use(app){
    
    //задаем локальные переменные и время старта загрузки контента
    app.use(initialize);
    
    //logger
    app.use(require('koa-logger')());
    
    //security headers to make your app more secure.
    if (g.config.use_secure) {
        var helmet = require('koa-helmet');
        app.use(helmet.defaults({ xframe: false }));
        app.use(helmet.iexss({ setOnOldIE: true }));
        app.use(helmet.ienoopen());
        app.use(helmet.hidePoweredBy());
    }

    if( g.config.auto.use_https ) {
        // Force SSL on all page (редирект всех на ssl)
        app.use(require('koa-force-ssl')());
    }
    
    //задаем параметры сессии в файле session.keys (содержимое в виде массива ['key1','key2'])
    app.keys = f.readJsonSync(g.path.join(g.config.app_path,'/keys/session.keys'),1);
    var session_options = f.readJsonSync(g.path.join(g.config.app_path,'/keys/session.options'),0);
    if (!session_options || !session_options.key) session_options = {key:'koa:sess'};
    //app.use(require('koa-session')(session_options));
    require('koa-session')(session_options,app);

    
    //разбор параметров
    app.use(require('koa-bodyparser')());
    
    app.use(require('./load_req_functions.js'));

    require('./ect.js')(app);
    
    app.use(require('koa-conditional-get')());
    //app.use(require('koa-etag')());
    
}

function* initialize(next) {
    //this.locvars - переменные доступные во время обработки запроса.
    this.locvars = {};
    this.locvars.start_load = new Date;
    
    this.catch_error = require(g.config.scripts_path+'/error/catch.js').catch_error;
    try {
        yield next;
    } catch(e) {
        this.status = 500;
        yield this.catch_error(e);
    }
    if (this.status != 404) return;
    yield this.catch_error(404,'page not found');
}

//-----------------------------------------------------------
/***********************
//задаем параметры для отправки статичных файлов (для этого модуля нужен bluebird, https://github.com/spion/bluebird)
var serve = require('koa-static');
app.use(serve('.'));
// $ GET /hello.txt
app.use(serve('test/fixtures'));
***********************/
/***********************
require('koa-onerror')(app);
app.use(require('koa-logger')());
app.use(require('koa-response-time')());

app.use(require('koa-favicon')(__dirname + '/public/favicon.ico'));





var passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

var user = { id: 1, username: 'test' }

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    done(null, user)
})

var LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
    // retrieve user ...
    if (username === 'test' && password === 'test') {
        done(null, user)
    } else {
        done(null, false)
    }
}))
******************************/
//-----------------------------------------------------------
