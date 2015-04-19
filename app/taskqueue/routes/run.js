'use strict';
console.log('  load app/taskqueue/load_routes/run.js..');

var g = require('../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;

var trim = g.u.str.trim;
var db_name = 'taskqueue';

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports.run = function(){ return run;}

module.exports.start_next_task_run = start_next_task_run;
module.exports.start_next_task     = start_next_task;


function* run(next){

    var p = this.request.query;
    //clog(g.mixa.dump.var_dump_node('p',p,{max_str_length:90000}));
    {//проверяем все ли необходимые параметры заданы
	var arr_check = ['name','note','run_json','cache_text','user_info','out_file'];
	for(var i=0;i<arr_check.length;i++){
	    var test = arr_check[i];
	    if (!p[test]) {
		this.body = {error:'не задан параметр "'+test+'"'};
		return yield next;
	    }
	}
	
	try{
	    if (!g.u.isObject(p.run_json) && g.u.isString(p.run_json)) {
		p.run_json = JSON.parse(p.run_json);
	    }
	}catch(err){
	    clog('ERROR JSON.parse string:');
	    clog(p.run_json);
	    clog(f.merr(err).toString());
	    this.body = {error:'не верно задан параметр p.run_json: "'+p.run_json+'"',info:f.merr(err).toString()};
	    return yield next;
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
    
    //clog(g.mixa.dump.var_dump_node('p',p,{max_str_length:90000}));
    
    var q = 'SELECT t.out_file,t.date_create,t.date_run,t.date_end,t.status, '+
            ' idc AS idt,(SELECT q.idc FROM task_queue q WHERE q.idc_task=t.idc AND q.user_info_hash=\''+p.user_info_hash+'\') AS idq '+
            ' FROM task t WHERE t.cache_hash=\''+p.cache_hash+'\'';
    var rows = yield f.db.gen_query(db_name,q);
    
    if (rows.length==0) { // если такое задание ещё не выполнялось то добавляем его в очередь
	return yield create_new_task(this,p,next); 
    }
    
    //если такое задание уже было отправлено в очередь
    var row = rows[0];
    p.out_file = g.u.str.trim(row.out_file);
    p.date_create = g.u.str.trim(row.date_create);
    p.date_run = g.u.str.trim(row.date_run);
    p.date_end = g.u.str.trim(row.date_end);
    p.status = g.u.str.trim(row.status);
    p.idq = g.u.str.trim(row.idq);
    p.idt = g.u.str.trim(row.idt);
    p.status = row.status;
    
    if (!p.idq) { //обновляем информацию по количеству клиетов ожидающих ответа
	yield create_new_client(this,p,next);
	this.body = {msg:'ваша задача уже в очереди "'+p.idt+'", ваш id очереди: "'+row.idq+'"',p:p};
    }else{
	this.body = {msg:'ваша задача и ваш клиент уже в очереди',p:p};
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
    }
    

    yield next;
}

function* create_new_task(self,p,next) {
    
    var q = 'SELECT UUID_TO_CHAR( GEN_UUID() ) AS idt, UUID_TO_CHAR( GEN_UUID() ) AS idq FROM rdb$database';
    var rows = yield f.db.gen_query(db_name,q);
    var row = rows[0];
    p.idt = g.u.str.trim(row.idt);
    p.idq = g.u.str.trim(row.idq);
    
    var q = 'INSERT INTO task(idc,idc_first_run,name,note,run_json,out_file,cache_text,cache_hash, status) '+
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
    
    self.body = {msg:'создана новая задача "'+p.idt+'", ваш id очереди: "'+p.idq+'"',p:p,queue:queue};
    
    clog('создана новая задача '+p.idt);
    
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
	
	{
	  var dir = g.path.dirname(p.out_file);
	  yield tf(g.mixa.path.mkdir)(dir);  // создаем каталог для результата выполнения задачи
	}
	
	
	//clog(g.mixa.dump.var_dump_node('s',s,{max_str_length:90000}));
	
	/*var out_stream = g.fs.createWriteStream(p.out_file,{flags:'w'});*/
	var     stream = g.fs.createWriteStream(p.out_file,{flags:'w'});
	
	var run = { run:s.run, args:check_arguments(s.args), log:p.out_file+'.log', enc:'utf-8'/*,out_stream:out_stream*/ };
	//clog(g.mixa.dump.var_dump_node('run1',run,{max_str_length:90000}));
	
    
	
	run.on_data = function(data) {
	    //data = new Buffer(data);
	    stream.write(data);
	}
	
	
	
	var exit_code = yield tf(g.process_logger)(run);
	
	//out_stream.end();
	stream.end();
	    
	var q = 'UPDATE task t SET t.status = 4, t.date_end = current_timestamp WHERE t.idc = \''+p.idt+'\'';
	yield f.db.gen_query(db_name, q);
	
	start_next_task_run();
    },function(err){
	if (err){
	    clog('ERROR in start_next_task[1]');
	    clog(f.merr(err).toString());
	    return start_next_task_run();
	}
    });
}


function start_next_task_run() {
    setTimeout(function(){
    f.run_gen(start_next_task,function(err){
	if (err){
	    clog('ERROR in start_next_task[2]');
	    clog(f.merr(err).toString());
	    return start_next_task_run();
	}
    });
    },200);
}

var is_firs_run = 1;
function* start_next_task() {
    
    var que_query = '1';  //берем только задачи из очереди
    if (is_firs_run) {
	is_firs_run = 0;
	que_query = '1,2';  //берем задачи из очереди и незавершенные задачи
    }
    var queue = yield get_queue(que_query);
    if (!queue || !queue.length){
	clog('нет задач в очереди');
	return;
    }
    var p = queue[0];
    
    for(var i in p){
	p[i] = trim(p[i]);
    }
    
    var q = 'UPDATE task t SET t.status = 2 WHERE t.idc = \''+p.idt+'\'';
    yield f.db.gen_query(db_name, q );
    
    start_task(p);
}

function check_arguments(aa) {
    for(var i=0;i<aa.length;i++){
	//var a = aa[i];
	//aa[i] = aa[i].replace(/\&/g,'^&');
	//aa[i] = aa[i].replace(/\=/g,'^=');
	//aa[i] = '"'+aa[i]+'"';
    }
    return aa;
}

/***
setInterval(function(){
    
},1000);
***/
//g.mixa.dump.var_dump_node('a',{rows:rows,p:p},{dump_max_level:10,exclude: [/\.socket/i,/\._/i]});

