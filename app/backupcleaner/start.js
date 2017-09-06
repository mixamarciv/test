'use strict';
console.log('  load app/backupcleaner/start.js..');

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
          console.error('\n\n\n  '+c.app_name+' START ERROR:  \n\n');
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
        process.title = c.app_name;
        
        //убиваем предыдущий процесс
        yield tf(require('kill-prev-app-process'))({
            path: g.path.join2(c.temp_path,'pid'),   // где храним pid текущего-предыдущего процесса
            wait: 10                                               // сколько ждем после завершения предыдущего процесса 
        });
        
        clog('start test -----------------------------');
        yield test();
        clog('end   test -----------------------------');
        
    },end_load);
    
    function end_load(err) {
      clog('\n  time load: '+g.mixa.str.time_duration_str(g.data.app_start_time));
      if (err) {
        console.error('\n\n\n  '+c.app_name+' START ERROR:  \n\n');
        f.merr(err,'load error:');
        console.error(err);
        return mainfn(err);
      }
      clog('\n\n'+c.app_name+' is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
      mainfn();
    }
}

function *test() {
    clog('AAAAA');
    var db = require('mixa_db_js_functions');
    var options = {
        dbtype: 'ibase',
        database: 'd:/_db_web/db001/0001__old.fdb1',
        host: '127.0.0.1',     // default
        port: 3050,            // default
        user: 'SYSDBA',        // default
        password: 'masterkey'  // default
    };

    db.connect(options,function(err,connect){
        if(err) throw(err);
        
        connect.query('SELECT lcode,fio FROM kart WHERE 1=1',function(err,rows){
            if(err) throw(err);
            console.log(rows);
        });
    });
}
