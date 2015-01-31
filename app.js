'use strict';
console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);
var main_start_load_time = new Date();

var clog = console.log;

var g = require('./inc.js');
var f = g.functions;
var tf = g.thunkify;

f.run_gen(function*(){
    process.title = g.config.app_name;
    
    //убиваем предыдущий процесс
    yield tf(require('kill-prev-process-app'))(g.config.options_kill_prev_app_process);
    
    var app = require('koa')();
    
    //задаем настройки приложения
    require('./app/app_use/index.js')(app);
    
    //загрузка роутов из всех поддиректорий g.config.scripts_path
    var load_all_routes = require('./app/app_load/index.js');
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
    g.data.db.app = yield tf(g.db.connect)(g.config.db['app']);
    
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
  clog('\n  time load: '+g.mixa.str.time_duration_str(main_start_load_time));
  if (err) {
    console.error('\n\n\n  SERVER START ERROR:  \n\n');
    f.merr(err,'load error:');
    console.error(err);
    return;
  }
  clog('\n\nserver is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
}

