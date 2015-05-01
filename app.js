'use strict';
console.log('start node %s (%s%s; pid:%s)',process.version,process.platform,process.arch,process.pid);

//console.log('start (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);


var clog = console.log;
var g = require('./main_inc.js');
var c = g.config;


var run_file = c.args.app;
clog('run '+run_file);

g.fs.exists(run_file,function(ex){
    if (!ex) return console.error('file "'+run_file+'" not found!');
    require('./'+run_file)();
});

