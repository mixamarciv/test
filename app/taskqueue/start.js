'use strict';
console.log('  load app/taskqueue/taskqueue.js..');

var clog = console.log;

var g = require('./inc.js');
var f = g.functions;
var tf = g.thunkify;

var listen_port = g.config.http_port;

module.exports = function(fn){
    start(function(err){
        if (err) {
          if(fn) return fn(err);
          console.error('\n\n\n  TASKQUEUE START ERROR:  \n\n');
          f.merr(err,'load error:');
          console.error(err);
          return fn(err);
        }
        

        if(fn) return fn(null);
        //clog('\n\nserver is running '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
        
    });
}

function start(err,mainfn){
    f.run_gen(function*(){
        process.title = 'taskqueue (port:'+listen_port+')';
        
        //убиваем предыдущий процесс
        yield tf(require('kill-prev-app-process'))({
            path: g.path.join2(g.config.main_temp_path,'pid/taskqueue'),   // где храним pid текущего-предыдущего процесса
            wait: 10                                                  // сколько ждем после завершения предыдущего процесса 
        });
        
        var app = require('koa')();
        
        //задаем настройки приложения
        require('./app_use/app_use.js')(app);
        
        //загрузка роутов из всех поддиректорий g.config.scripts_path
        var load_all_routes = require('./routes/load_routes.js');
        clog('\nload routes:');
        yield load_all_routes(app);
        
        var server = require('http').createServer(app.callback());
        var http = tf(start_listner)(server,listen_port);
        
        clog('\nconnect app database');
        yield f.db_app.gen_connect('taskqueue');
        
        clog('\nstart listeners:');
        yield [http];
        
        var qtasks = require('./routes/run.js');
        clog('\n  restart prev tasks');
        //clog(g.mixa.dump.var_dump_node('qtasks',qtasks,{max_str_length:90000}));
        yield qtasks.start_prev_tasks();
        
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


