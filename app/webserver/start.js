'use strict';
console.log('  load app/webserver/webserver.js..');

var clog = console.log;

var g = require('./inc.js');
var f = g.functions;
var tf = g.thunkify;
var c = g.config;
var path_join = g.path.join2;

module.exports = function(fn){
    start(function(err){
        if (err) {
          if(fn) return fn(err);
          console.error('\n\n\n  WEBSERVER START ERROR:  \n\n');
          f.merr(err,'load error:');
          console.error(err);
          return fn(err);
        }
        if(fn) return fn(null);
        clog('\n\nserver is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
    });
}

function start(err,mainfn){
    f.run_gen(function*(){
        //process.title = c.app_name+' (port:80,443)';

        //убиваем предыдущий процесс
        yield tf(require('kill-prev-app-process'))({
            path: g.path.join2(c.temp_path,'pid/webserver'),   // где храним pid текущего-предыдущего процесса
            wait: 10                                               // сколько ждем после завершения предыдущего процесса
        });

        var app = require('koa')();

        //задаем настройки приложения
        require('./app_use/app_use.js')(app);

        //загрузка роутов из всех поддиректорий g.config.scripts_path
        var load_all_routes = require('./routes/load_routes.js');
        clog('\nload routes:');
        yield load_all_routes(app);

        var server80 = require('http').createServer(app.callback());
        var http = tf(start_listner)(server80,80);

        var https = null;
        var keys_path = c.app_ssl_keys_path;
        var https_test = yield f.fs.gen_exists(keys_path);
        if (https_test) https_test = yield f.fs.gen_exists(keys_path+'/server.key');
        if (https_test) https_test = yield f.fs.gen_exists(keys_path+'/server.key');
        if (https_test) {
            var ssl_options = {
              key: g.fs.readFileSync(keys_path+'/server.key'),
              cert: g.fs.readFileSync(keys_path+'/server.crt')
            }
            var server443 = require('https').createServer(ssl_options, app.callback());
            https = tf(start_listner)(server443,443);
        }else{
            clog('\nhttps key & crt files not found');
        }
        g.config.auto.use_https = https_test;

        clog('\nconnect app database');
        yield f.db_app.gen_connect('webserver');


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
