'use strict';
console.log('  load app/load_webserver/webserver.js..');

var clog = console.log;

var g = require('../../inc.js');
var f = g.functions;
var tf = g.thunkify;


module.exports.start = function(err,mainfn){
    f.run_gen(function*(){
        process.title = g.config.app_name;
        
        //убиваем предыдущий процесс
        yield tf(require('kill-prev-app-process'))(g.config.options_kill_prev_app_process);
        
        var app = require('koa')();
        
        //задаем настройки приложения
        require('./app_use/app_use.js')(app);
        
        //загрузка роутов из всех поддиректорий g.config.scripts_path
        var load_all_routes = require('./routes/load_routes.js');
        clog('\nload routes:');
        yield load_all_routes(app);
        
        var server80 = require('http').createServer(app.callback());
        var http = tf(start_listner)(server80,80);
        
        var ssl_options = {
          key: g.fs.readFileSync('./keys/server.key'),
          cert: g.fs.readFileSync('./keys/server.crt')
        }
        var server443 = require('https').createServer(ssl_options, app.callback());
        var https = tf(start_listner)(server443,443);
        
        clog('\nconnect app database');
        yield f.db_app.gen_connect();
        
        
        clog('\nstart listeners:');
        yield [http, https];
        
    },end_load);
    
    function start_listner(server,port,fn) {
        server.listen(port,function(err){
            if(!err) clog('  listen port '+port);
            fn(err);
        });
    }
    
    function end_load(err) {
      clog('\n  time load: '+g.mixa.str.time_duration_str(g.data.app_start_time));
      if (err) {
        console.error('\n\n\n  SERVER START ERROR:  \n\n');
        f.merr(err,'load error:');
        console.error(err);
        return mainfn(err);
      }
      clog('\n\nserver is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
      mainfn();
    }
}
