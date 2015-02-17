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


    var p = this.request.query;
    
    {//проверяем все ли необходимые параметры заданы
	var arr_check = ['name','note','script','cache_text','user_info'];
	for(var i=0;i<arr_check.length;i++){
	    var test = arr_check[i];
	    if (!p[test]) {
		this.body = {error:'не задан параметр "'+test+'"'};
		return yield next;
	    }
	}
    }

    p.name;
    p.note;
    p.script;
    p.cache_text;
    p.cache_hash = g.crypto.createHash('sha1').update(p.cache_text).digest('hex');
    p.user_info;
    

    var q = 'SELECT idc FROM task WHERE cache_hash=\''+p.cache_hash+'\'';
    var rows = yield f.db.gen_query(db_name,q);
    
    if (rows.length==0) { // если такое задание ещё не выполнялось то запускаем его заново
	return yield create_new_task(this,p); 
    }
    
    //если такое уже было отправлено в очередь то обновляем информацию по количеству клиетов ожидающих ответа
    var row = rows[0];
    

    //this.body = ;
    this.body = g.mixa.dump.var_dump_node('a',{rows:rows,p:p},{dump_max_level:10,exclude: [/\.socket/i,/\._/i]});


    yield next;
}

function* create_new_task(self,p) {
    ;
    
    var q = 'SELECT UUID_TO_CHAR( GEN_UUID() ) AS idt, UUID_TO_CHAR( GEN_UUID() ) AS idq FROM rdb$database';
    var rows = yield f.db.gen_query(db_name,q);
    var row = rows[0];
    row.idt = g.u.str.trim(row.idt);
    row.idq = g.u.str.trim(row.idq);
    
    var q = 'INSERT INTO task(idc,idc_firs_run,name,note,script,cache_text,cache_hash) '+
	    'VALUES (?, ?, ?, ?, ?, ?, ?)';
    yield f.db.gen_query(db_name, q, [row.idt, row.idq, p.name, p.note, p.script, p.cache_text, p.cache_hash]);
    
    var q = 'INSERT INTO task_queue(idc,idc_task,user_info) '+
	    'VALUES (?, ?, ?)';
    yield f.db.gen_query(db_name, q, [ row.idq, row.idt, p.user_info]);
    
    self.body = 'создана новая задача "'+g.u.str.trim(String(row.idt))+'", ваш id очереди: "'+String(row.idq)+'"';
}



