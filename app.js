'use strict';
console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);


var clog = console.log;
var g = require('./inc.js');
var c = g.config;
var is_run = 0;

if ( c.args.app == 'webserver' ) {
    is_run = 1;
    require('app/webserver/webserver.js')();
}

if ( c.args.app == 'taskqueue' ) {
    is_run = 1;
    require('app/taskqueue/taskqueue.js')();
}


if ( !is_run ) {
    clog('\n\napp not found! (bad --app param)\n\n');
}
