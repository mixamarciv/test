'use strict';
//скрипт для автоматического запуска и перезапуска приложений
console.log('start node %s (%s%s; pid:%s)',process.version,process.platform,process.arch,process.pid);

var clog = console.log;
var app_name = process.argv[2];
var args = process.argv.slice(2);
clog('run forever-monitor '+app_name);
clog('arguments:',args);

function start() {
    var forever = require('forever-monitor');
    var short_app_name = get_app_name();
    process.title = short_app_name;
    var options = {
        max : 100,                           // max count restart app
        silent : false,
        'logFile': get_log_file_name('log'), // Path to log output from forever process (when daemonized)
        'outFile': get_log_file_name('out'), // Path to log output from child stdout
        'errFile': get_log_file_name('err'), // Path to log output from child stderr
        'test': 0
    }
    
    var child = forever.start(args,options);
    var i_restart_count = 0;
    child.on('restart', function() {
        i_restart_count++;
        clog('==========================================================================');
        clog('restart ' + short_app_name + ' ('+i_restart_count+'/'+options.max+')');
    });
    
    child.on('exit', function (){
        clog(short_app_name+' has exited after '+options.max+' restarts');
    });
}


var g = require('./main_inc.js');
var c = g.config;
var log_path = g.path.join2(c.temp_path,'/logs');
    log_path = g.path.join2(log_path,get_app_name());
    log_path = g.path.join2(log_path,g.mixa.str.date_format('YMD-hms'));
function get_log_file_name(prefix) {
    return g.path.join2(log_path,prefix+'_log.txt');    
}

var check_log_dir = g.path.dirname(get_log_file_name('test'));
g.path.mkdir_path(check_log_dir,function(err){
    if (err) return console.error(err);
    start();
});

function get_app_name() {
    var s = args.join(' ');
    s = s.replace(/start\.js$/g,' ');
    s = s.replace(/(\/|\\|\||\:|\?|\%|\!|\^|\"|\'|\*|\#|\`|\~|^node\.exe|\-\-harmony)/g,' ');
    s = g.u.str.trim(s);
    s = s.replace(/(test\.js|^app\.js|\-\-app\=)/g,' ');
    s = g.u.str.trim(s);
    s = s.replace(/  /g,' ');
    s = s.replace(/ /g,'_');
    return s;
}
