'use strict';
console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);

var g = require('./inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

//убиваем предыдущий процесс
require('kill-prev-process-app')(g.config.options_kill_prev_app_process,function(){
    
    var app = require('koa')();
    
    //задаем настройки приложения
    require('./app/app_use/index.js')(app);
    
    //загрузка роутов из всех поддиректорий g.config.scripts_path
    var load_all_routes = require('./app/app_load/index.js');
    load_all_routes(app,function(err){
        if (err) throw(err);
        
        // SSL options
        var ssl_options = {
          key: g.fs.readFileSync('./keys/server.key'),
          cert: g.fs.readFileSync('./keys/server.crt')
        }
        
        // start the server
        clog('run http server');
        require('http') .createServer(app.callback()).listen(80,server_is_ready);
        
        clog('run https server');
        require('https').createServer(ssl_options, app.callback()).listen(443,server_is_ready);
        
    });
    
});


var ss = 0;
function server_is_ready(err) {
  if (err) {
    console.error('\n\n\n  SERVER START ERROR:  \n\n');
    console.error(err);
    return;
  }
  if ( ++ss > 1 ) {
    clog('\n\nserver is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
  }
}
