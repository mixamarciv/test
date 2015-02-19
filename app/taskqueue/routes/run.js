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
	var arr_check = ['name','note','run_json','cache_text','user_info','out_file'];
	for(var i=0;i<arr_check.length;i++){
	    var test = arr_check[i];
	    if (!p[test]) {
		this.body = {error:'не задан параметр "'+test+'"'};
		return yield next;
	    }
	}
	
	if (!p.run_json.run) {
	    var run = p.run_json;
	    p.run_json = {run:run};
	}
    }

    p.name;
    p.note;
    p.run_json;  //run,args
    p.out_file;
    p.cache_text;
    p.cache_hash = g.crypto.createHash('sha1').update(p.cache_text).digest('hex');
    p.user_info;
    p.user_info_hash = g.crypto.createHash('sha1').update(p.user_info).digest('hex');
    
    var q = 'SELECT t.out_file,t.date_create,t.date_run,t.date_end,t.status, '+
            ' idc AS idt,(SELECT q.idc FROM task_queue q WHERE q.idc_task=t.idc AND q.user_info_hash=\''+p.user_info_hash+'\') AS idq '+
            ' FROM task t WHERE t.cache_hash=\''+p.cache_hash+'\'';
    var rows = yield f.db.gen_query(db_name,q);
    
    if (rows.length==0) { // если такое задание ещё не выполнялось то добавляем его в очередь
	return yield create_new_task(this,p,next); 
    }
    
    //если такое задание уже было отправлено в очередь
    var row = rows[0];
    p.idt = g.u.str.trim(row.idt);
    p.idq = g.u.str.trim(row.idq);
    p.status = row.status;
    
    if (!p.idq) { //обновляем информацию по количеству клиетов ожидающих ответа
	yield create_new_client(this,p,next);
	this.body = {msg:'ваша задача уже в очереди "'+p.idt+'", ваш id очереди: "'+row.idq+'"',idq:p.idq,idt:p.idt};
    }else{
	this.body = {msg:'ваша задача и ваш клиент уже в очереди',idq:p.idq,idt:p.idt};
    }   
    
    if (p.status==1) {
	var queue = yield get_queue();
	this.body.info = 'задача находится на '+queue.length+' позиции в очереди';
    }else
    if (p.status==2) {
	this.body.info = 'задача уже выполняется';
    }else
    if (p.status==4) {
	this.body.info = 'процесс завершен';
	this.body.out_file = p.out_file;
    }
    

    yield next;
}

function* create_new_task(self,p,next) {
    
    var q = 'SELECT UUID_TO_CHAR( GEN_UUID() ) AS idt, UUID_TO_CHAR( GEN_UUID() ) AS idq FROM rdb$database';
    var rows = yield f.db.gen_query(db_name,q);
    var row = rows[0];
    p.idt = g.u.str.trim(row.idt);
    p.idq = g.u.str.trim(row.idq);
    
    var q = 'INSERT INTO task(idc,idc_firs_run,name,note,run_json,out_file,cache_text,cache_hash, status) '+
	    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)';
    /***
    status
    0 - только созданная задача
    1 - поставлена в очередь
    2 - выполняется
    3 - прервана
    4 - завершена
     ***/
    yield f.db.gen_query(db_name, q, [p.idt, p.idq, p.name, p.note, JSON.stringify(p.run_json), p.out_file, p.cache_text, p.cache_hash]);  
    
    var q = 'INSERT INTO task_queue(idc,idc_task,user_info,user_info_hash) '+
	    'VALUES (?, ?, ?, ?)';
    yield f.db.gen_query(db_name, q, [p.idq, p.idt, p.user_info, p.user_info_hash]);
    
    var queue = yield get_queue();
    
    self.body = {msg:'создана новая задача "'+p.idt+'", ваш id очереди: "'+p.idq+'"',idq:p.idq,idt:p.idt,queue:queue};
    
    if (queue.length==0) {
	start_task(p);
	self.body.info = 'задача выполняется';
    }else{
	var q = 'UPDATE task t SET t.status = 1 WHERE t.idc = \''+p.idt+'\'';
	yield f.db.gen_query(db_name, q );
	self.body.info = 'задача находится на '+queue.length+' позиции в очереди';
    }

    
    yield next;
}

function* create_new_client(self,p) {
    var q = 'SELECT UUID_TO_CHAR( GEN_UUID() ) AS idq FROM rdb$database';
    var rows = yield f.db.gen_query(db_name,q);
    var row = rows[0];
    p.idq = g.u.str.trim(row.idq);
    
    var q = 'INSERT INTO task_queue(idc,idc_task,user_info,user_info_hash) '+
	    'VALUES (?, ?, ?, ?)';
    yield f.db.gen_query(db_name, q, [p.idq, p.idt, p.user_info, p.user_info_hash]);
}

function* get_queue(type_queues) {
    if (!type_queues) {
	type_queues = '/* 1 - в очереди */ 1, 2 /* 2 - выполняется */';
    }
    var q = 'SELECT t.idc AS idt,t.status,t.date_create,t.name,t.run_json,t.out_file \n'+
            ' FROM task t \n'+
            ' WHERE t.status IN ('+type_queues+') \n'+
	    ' ORDER BY t.date_create ';
    var rows = yield f.db.gen_query(db_name, q);
    return rows;
}

function start_task(p) {
    /****/
    f.run_gen(function*(){
	
	var q = 'UPDATE task t SET t.status = 2, t.date_run = current_timestamp WHERE t.idc = \''+p.idt+'\'';
	yield f.db.gen_query(db_name, q);
	
	clog('запускается задача '+p.idt);
	
	var s = p.run_json;
	try{
	    if (!g.u.isObject(s) && g.u.isString(s)) {
		s = JSON.parse(s);
	    }
	}catch(err){
		clog('ERROR JSON.parse string:');
		clog(s);
		clog(f.merr(err).toString());
		return start_next_task_run();
	}
	
	
	var run = {run:s.run,args:s.args,log:p.out_file+'.log'};
	
	var stream = g.fs.createWriteStream(p.out_file);
    
	run.on_data = function(data){
	    stream.write(data);
	}
	
	
	var exit_code = yield tf(g.process_logger)(run);
	stream.end();
	
	var q = 'UPDATE task t SET t.status = 4, t.date_end = current_timestamp WHERE t.idc = \''+p.idt+'\'';
	yield f.db.gen_query(db_name, q);
	
	yield start_next_task();
	
    },function(err){
	if (err){
	    clog('ERROR in start_next_task');
	    clog(f.merr(err).toString());
	    //return start_next_task_run();
	}
    });
    /*****/
    /****
    //g.mixa.path.mkdir
    //var run = {run:p.script,log:'file.log',args:['argument1','arg2'],on_data:function(data){console.log(data);}}

    
    var run = {run:s.run,args:s.args,log:p.out_file+'.log'};


    
    g.process_logger(run,function(err,exit_code){
	stream.end();
	if (err){
	    clog('ERROR in process_logger');
	    clog(f.merr(err).toString());
	    return;
	}
	var q = 'UPDATE task t SET t.status = 4, t.date_end = current_timestamp WHERE t.idc = \''+p.idt+'\'';
	f.db.query(db_name, q, function(err){
	    if (err){
		clog('ERROR in f.db.query');
		clog(f.merr(err).toString());
		return;
	    }
	    start_next_task_run();
	});
    });
    
    ******/
}

function start_next_task_run() {
    f.run_gen(start_next_task,function(err){
	if (err){
	    clog('ERROR in start_next_task');
	    clog(f.merr(err).toString());
	    return;
	}
    });
}

function* start_next_task() {
    var queue = yield get_queue('1');
    if (!queue || !queue.length){
	clog('нет задач в очереди');
	return;
    }
    var p = queue[0];
    
    var q = 'UPDATE task t SET t.status = 2 WHERE t.idc = \''+p.idt+'\'';
    yield f.db.gen_query(db_name, q );
    
    start_task(p);
}

/***
setInterval(function(){
    
},1000);
***/
//g.mixa.dump.var_dump_node('a',{rows:rows,p:p},{dump_max_level:10,exclude: [/\.socket/i,/\._/i]});

