'use strict';
var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

module.exports.load_menu = function(fn){
    var menu_item = {};
    menu_item.link = route_path;
    menu_item.name = 'тестовый скрипт1';
    
    fn(null,menu_item);
}

module.exports.load_route = function(router,fn){
    //router.redirect('/','/main');
    var all_t = g.config.auto.templates.names;
    router.get(route_path, function*(next) {
        var data1 = yield g.co(this_function);
        
        this.render('index.html', {data1:data1});
        yield next;
    });
    fn();
}

function *this_function() {
    var data = {test:1};
    data.path = 'f:/temp/vdgar/test';
    data.files = yield tf(g.fs.readdir)('f:/temp/vdgar/test');
    data.work_files = [];
    var i = data.files.length;
    while(i--){
        var file = data.files[i];
        var ok = 0;
        if (/xls/i.test(file) && /08/i.test(file) && !/run_log/i.test(file) && !/__temp/i.test(file)) {
            ok = 1;
        }
        if (!ok) continue;
        var sss = {file:file};
        
        sss.time = get_need_time(file);
        
        var full_file_path = g.path.join(data.path,data.files[i]);
        var temp_path = full_file_path + '__temp';
        
        yield tf(g.mixa.path.rmdir)(temp_path);
        
        yield f.run_gen(change_sys_times)(sss.time,temp_path);
        yield f.run_gen(extract_files_7z)(full_file_path,temp_path);
        
        data.work_files.push(sss);
        
        //data.cmd7z = {run:g.path.join(g.config.app_path,'.bin/run_7z_extract.bat'), args:[full_file_path,temp_path], log:full_file_path+'.run_log'};        
        
        //yield tf(change_file_times)(temp_path,);
        
        //yield tf(change_file_times)(temp_path,);
        
    }
    //g.process_logger()
    //g.co(function*(){
    
        
        
    //return fn(null,data);
    return data;
    //})();
}

function get_need_time(file) {
    var t = g.path.basename(file);
    var matches = /[ \_](\d\d\d\d)[\-\.](\d\d)[\. ]/.exec(file);

    var year  = matches[1];
    var month = matches[2];
    var d = new Date(year, month, f.random_int(10,19), f.random_int(9,20), f.random_int(0,59), f.random_int(0,59));
    d.setMonth(d.getMonth());

    return d;
}

function* extract_files_7z(from_file,to_path) {
    yield tf(g.mixa.path.mkdir)(to_path);
    var cmd = {run:g.path.join(g.config.app_path,'.bin/run_7z_extract.bat'), args:[from_file,to_path], log:from_file+'.run_log'};
    yield tf(g.process_logger)(cmd);
}

function* change_sys_times(time,path) {
    var date_str = g.mixa.str.date_to_str_format(time,'D-M-Y');
    var cmd = g.path.join(g.config.app_path,'.bin/run_command.bat');
    var cmd1 = {run:cmd, args:['date',date_str], log:path+'_change_date.log'};        
    yield tf(g.process_logger)(cmd1);
    
    var time_str = g.mixa.str.date_to_str_format(time,'h:m:s');
    var cmd2 = {run:cmd, args:['time',time_str], log:path+'_change_time.log'};        
    yield tf(g.process_logger)(cmd2);
    
    yield tf(f.wait)(1000);
}

function change_file_times(path,time,fn) {
    var atime = time;
    var mtime = time;
    g.co(function*(){
        var files = yield tf(g.fs.readdir)(path);
        var i = files.length;
        while(i--){
            var file = g.path.join(path,files[i]);
            yield tf(g.fs.utimes)(file, atime, mtime);
        }
        return fn();
    })();
}

