'use strict';
console.log('  load app/taskqueue/load_routes/run.js..');

var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;

var trim = g.u.str.trim;
var db_name = 'taskqueue';

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports.status = function(){ return status;}



function* status(next){

    var p = this.request.query;
    //clog(g.mixa.dump.var_dump_node('p',p,{max_str_length:90000}));
    {//проверяем все ли необходимые параметры заданы
	var arr_check = ['idq'];
	for(var i=0;i<arr_check.length;i++){
	    var test = arr_check[i];
	    if (!p[test]) {
		this.body = {error:'не задан параметр "'+test+'"'};
		return yield next;
	    }
	}
	
	if(p.idq.length != 36){
	    this.body = {error:'не верно задан параметр "idq" (длина меньше 36 символов)'};
	    return yield next;
	}
    }

    //clog(g.mixa.dump.var_dump_node('p',p,{max_str_length:90000}));
    
    var q = 'SELECT t.name,t.note,t.out_file,t.date_create,t.date_run,t.date_end,t.status,t.idc AS idt,tf.user_info,CURRENT_TIMESTAMP AS date_cur, \n'+
            '   (SELECT COUNT(*) FROM task_queue q WHERE q.idc_task=t.idc) AS count_idq \n'+
            ' FROM task t \n'+
	    '   LEFT JOIN task_queue tq ON tq.idc_task=t.idc \n'+
	    '   LEFT JOIN task_queue tf ON tf.idc_task=t.idc AND tf.idc=t.idc_first_run \n'+
	    ' WHERE tq.idc=\''+p.idq+'\'';
    var rows = yield f.db.gen_query(db_name,q);
    
    if (rows.length==0) { 
	this.body = {error:'идентификатор очереди не найден (idq='+p.idq+')'};
	return yield next;
    }
    

    var row = rows[0];
    for(var i in row){
	row[i] = g.u.str.trim(row[i]);
    }
    
    
    row.queue = yield get_queue('1,2',row.idt);
    
    this.body = row;
    yield next;
}

function* get_queue(type_queues,idt) {
    if (!type_queues) {
	type_queues = '/* 1 - в очереди */ 1 /* 2 - выполняется */';
    }
    var q = 'SELECT t.date_run,t.date_create,t.name,t.note,tf.user_info,tf.idc AS idq \n'+
            ' FROM task t \n'+
	    '   LEFT JOIN task_queue tf ON tf.idc_task=t.idc AND tf.idc=t.idc_first_run \n'+
            ' WHERE t.status IN ('+type_queues+') \n'+
	    '   AND t.date_create < (SELECT a.date_create FROM task a WHERE a.idc=\''+idt+'\') \n'+
	    ' ORDER BY t.date_create ';
    var rows = yield f.db.gen_query(db_name, q);
    for(var j=0;j<rows.length;j++){
	var row = rows[j];
	for(var i in row){
	    row[i] = g.u.str.trim(row[i]);
	}
    }
    return rows;
}

