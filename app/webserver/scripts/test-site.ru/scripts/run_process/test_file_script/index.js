'use strict';
var g = require('../../../inc.js');
var f = g.functions;
var f2 = {
    rmdir: g.mixa.path.rmdir
}
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
    router.get(route_path, function*(next){
        var data1 = yield g.co(this_function);
        
        this.render('index.html', {data1:data1});
        yield next;
    });
    fn();
}



function *this_function() {
    var data = {test:1};
    
    var _start_time = new Date();
    try{
        data.path = 'f:/temp/vdgar/test';
        data.files = yield tf(g.fs.readdir)('f:/temp/vdgar/test');
        data.work_files = [];
        var i = data.files.length;
        while(i--){
            var file = data.files[i];
            var ok = 0;
            if ( /* /sql/i.test(file) && /08/i.test(file) && */ !/run_log/i.test(file) && !/__temp/i.test(file)) {
                ok = 1;
            }
            if (!ok) continue;
            var sss = {file:file};
            
            sss.time = get_need_time(file);
            sss.time2 = new Date(sss.time);
            sss.time2.setHours(sss.time.getHours()+f.random_int(0,1),sss.time.getMinutes()+f.random_int(5,20),f.random_int(1,59));
            
            var full_file_path = g.path.join(data.path,data.files[i]);
            var new_file = g.path.join(data.path,g.mixa.str.date_format('Y-M-D h-m-s'),data.files[i]);
            var temp_path = full_file_path + '__temp';
            
            yield tf(f2.rmdir)(temp_path);
            
            yield f.run_gen(change_sys_times)(sss.time,temp_path);
            yield f.run_gen(extract_files_7z)(full_file_path,temp_path);
            yield f.run_gen(change_files_content_times)(temp_path,sss.time);
            yield f.run_gen(change_file_times)(temp_path,sss.time2);
            yield tf(f.wait)(100);
            yield f.run_gen(add_files_to_arch_7z)(temp_path,new_file);
            data.work_files.push(sss);
            //data.cmd7z = {run:g.path.join(g.config.app_path,'.bin/run_7z_extract.bat'), args:[full_file_path,temp_path], log:full_file_path+'.run_log'};        
            
            //yield tf(change_file_times)(temp_path,);
            
            //yield tf(change_file_times)(temp_path,);
            
        }
    } catch(e) {
        data.error = e;
        data.err = f.merr(e,'хз');
    } finally {
        yield f.run_gen(change_sys_times)(_start_time,g.os.tmpdir());
    }

    return data;
}

function get_need_time(file) {
    var t = g.path.basename(file);
    var matches = /[ \_](\d\d\d\d)[\-\.](\d\d)[\. ]/.exec(file);

    var year  = matches[1];
    var month = matches[2];
    var d = new Date(year, month, f.random_int(10,19), f.random_int(9,20), f.random_int(0,59), f.random_int(0,59));
    d.setMonth(d.getMonth());
    d.setMilliseconds(f.random_int(10,999));

    return d;
}

//@"%zipPATH%\7z.exe" a -t7z "%out_file%.7z" "0000_update_meta.sql" "0001_update.sql" "start_update.php.bat" -m"x=9"
function* extract_files_7z(from_file,to_path) {
    yield tf(g.mixa.path.mkdir)(to_path);
    var cmd = {run:g.path.join(g.config.app_path,'.bin/run_7z_extract.bat'), args:[from_file,to_path], log:from_file+'.run_log'};
    yield tf(g.process_logger)(cmd);
}

function* add_files_to_arch_7z(from_path,to_file) {
    yield tf(g.mixa.path.mkdir)(g.path.dirname(to_file));
    var cmd = {run:g.path.join(g.config.app_path,'.bin/run_7z_add_archive.bat'), args:[to_file,from_path+'/*'], log:to_file+'.run_log'};
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
    //yield tf(f.wait)(1000);
}

function* change_file_times(path,time) {
    var atime = time;
    var mtime = time;
    var files = yield tf(g.fs.readdir)(path);
    var i = files.length;
    while(i--){
        var file = g.path.join(path,files[i]);
        if (!is_exclude_file_for_change_times(file)) {
            yield tf(g.fs.utimes)(file, atime, mtime);
        }
    }
}

function is_exclude_file_for_change_times(file) {
    var name = g.path.basename(file);
    if (name == 'start_update.php.bat') return 1;
    return 0;
}

function* change_files_content_times(path,time) {
    var files = yield tf(g.fs.readdir)(path);
    var i = files.length;
    while(i--){
        var file = g.path.join(path,files[i]);
        if (!is_exclude_file_for_change_conten_times(file)) {
            var data = yield tf(change_file_content_times)(file, time);
            console.log('data='+data);
            yield tf(g.fs.unlink)(file);
            yield tf(g.fs.rename)(file+'.new',file);
        }
    }
}

function is_exclude_file_for_change_conten_times(file) {
    var name = g.path.basename(file);
    if (name == '0001_update.sql') return 0;
    return 1;
}

function change_file_content_times(path,time,fn) {
    var readline = require('readline');
    var stream = require('stream');
    var instream = g.fs.createReadStream(path);
    var outstream = g.fs.createWriteStream(path+'.new');
    instream.setEncoding('CP1251');

    //outstream.readable = true;
    //outstream.writable = true;
    
    var rl = readline.createInterface({
        input: instream,
        output: outstream,
        terminal: false
    });
    
    var timeins = new Date(time.getYear(),time.getMonth(),time.getDate()-1);
    timeins.setHours(f.random_int(10,24),f.random_int(1,59),f.random_int(1,59),f.random_int(999));
    
    var test = 20;
    var i_line = 0;
    rl.on('line', function(line) {
        i_line++;
        //var line2 = g.iconv.encode(line,'CP1251');
        var new_line = change_content_time(i_line,line,time,timeins);
        
        if ( new_line != line && test-- > 0 ) {
            clog('old: '+ line);
            clog('new: '+ new_line);
        }
        
        outstream.write(new_line+'\n','CP1251');
        /*
        if (test && buff.toString('CP1251')!=line) {
            test = 0;
            clog('line1='+line);
            clog('line2='+line2);
        }
        */
    });
    
    rl.on("error", function(err) {
      err.type = 'rl';
      done(err);
      clog(null,'rl.error()');
    });
    instream.on("error", function(err) {
      err.type = 'instream';
      done(err);
      clog(null,'instream.error()');
    });
    outstream.on("error", function(err) {
      err.type = 'outstream';
      done(err);
      clog(null,'outstream.error()');
    });
    rl.on("close", function(err) {
      done(null,'rl');
      clog(null,'rl.close()');
    });
    outstream.on("close", function(ex) {
      done(null,'outstream');
      clog(null,'outstream.close()');
    });
    
    outstream.on("finish", function(ex) {
      done(null,'outstream');
      clog(null,'outstream.finish()');
    });
    outstream.on("drain", function(ex) {
      done(null,'outstream');
      clog(null,'outstream.drain()');
    });
    
    var isCalled = 0;
    function done(err,data) {
      if (!isCalled && data=='outstream') {
        clog('line cnt:'+i_line);
        isCalled = 1;
        fn(err,data);
        outstream.close();
        instream.close();
        rl.close();
      }
    }
    
}


function change_content_time(i_line,str,time,timeins) {
    if (!/\d\d\d\d[\.-]\d\d/.test(str)) return str;
    if (i_line==3 && /file\:/.test(str)){
        var re = /file: E:\/_db_web\/db001\/arch\/2014.12\/script3\/\/update_db001__\((\d{1,4})\)__(\d\d\d\d)-(\d\d).sql .*$/
        str = str.replace(re,'file: E:/_db_web/db001/arch/$2.$3/script3//update_db001__($1)__$2-$3.sql '+g.mixa.str.date_format(time,'Y.M.D_h-m-s.k'));
        return str;
    }
    //2014-01-04 14:34:42
    if (/^INSERT INTO/.test(str) && /\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d/.test(str)){
        var arr_repl = [];
        var re = /\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d/;
        var arr = re.exec(str);
        var i = arr.lengh;
        if (i>=2) {
            clog('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:');
            clog(arr);
        }
        while(i--){
          var str_d = arr[0];
            
          var d = g.moment(str_d,'YYYY-MM-DD hh:mm:ss');
          if ( d > timeins ) {
            arr_repl.push(str_d);
          }
        }

        i = arr_repl.length;
        if (i>0) {
            clog('arr_repl:');
            clog(arr_repl);
        }
        while(i--){
            var a = arr_repl[i];
            str.replace(a,g.mixa.str.date_format(timeins,'Y.M.D_h-m-s'));
        }
    }
    return str;
}


