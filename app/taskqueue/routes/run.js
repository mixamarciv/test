'use strict';
console.log('  load app/taskqueue/load_routes/run.js..');

var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;

var db_name = 'taskqueue';

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports = function(){
 return run;
}


function* run(next){
    //var rows = yield f.db.gen_query(db_name,'SELECT * FROM task');

    //var db = f.db.gen_connect(db_name);
    var p = this.request.query;
    var q = 'SELECT idc,name,note FROM task WHERE 1=?';
    var rows = yield f.db.gen_query('taskqueue',q,[1]);
    
    

    //this.body = ;
    this.body = g.mixa.dump.var_dump_node('a',{rows:rows,p:p,this:this},{dump_max_level:10,exclude: [/\.socket/i,/\._/i]});


    yield next;
}

