console.log('  load app/app_use/index.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

module.exports = function load_app_use(app){
    
    //logger
    app.use(require('koa-logger')());
    
    //security headers to make your app more secure.
    var helmet = require('koa-helmet');
    app.use(helmet.defaults({ xframe: false }));
    app.use(helmet.iexss({ setOnOldIE: true }));
    app.use(helmet.ienoopen());
    app.use(helmet.hidePoweredBy());
    
    //check error500 and 404
    app.use(require('./error_404_and_500.js'));
    
    // Force SSL on all page (редирект всех на ssl)
    app.use(require('koa-force-ssl')());
    
    //задаем параметры сессии в файле session.keys (содержимое в виде массива ['key1','key2'])
    app.keys = f.readJsonSync(g.path.join(g.config.app_path,'/keys/session.keys'),1);
    var session_options = f.readJsonSync(g.path.join(g.config.app_path,'/keys/session.options'),0);
    if (!session_options || !session_options.key) session_options = {key:'koa:sess'};
    app.use(require('koa-session')(session_options));
    app.use(function *(next) {
        var n = this.session.views || 0;
        this.session.views = ++n;
        //clog('session');
        yield next;
    });
    
    //разбор параметров
    app.use(require('koa-bodyparser')());
    
    require('./ect.js')(app);
}


//-----------------------------------------------------------
/***********************
//задаем параметры для отправки статичных файлов (для этого модуля нужен bluebird, https://github.com/spion/bluebird)
var serve = require('koa-static');
app.use(serve('.'));
// $ GET /hello.txt
app.use(serve('test/fixtures'));
***********************/

//-----------------------------------------------------------
/***********************
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
