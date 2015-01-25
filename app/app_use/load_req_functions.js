'use strict';
console.log('  load app/app_use/load_req_functions.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

var clog_err = function(msg,err){
    if(!g.config.debug.load_req_functions) return;
    console.error(msg);
    if (err) console.error(err);
}


module.exports = function *(next) {
    //меняем this.cookies.set и get
    require('./check_cookies.js')(this);
    
    check_session(this);
    
    //загружаем пользовательские данные из куков
    require('./load_user_data_from_cookies.js')(this);

    yield next;    
}

function check_session(ths) {
    if (!ths.session.start_time) ths.session.start_time = ths.locvars.start_load;
    var n = ths.session.views || 0;
    ths.session.views = ++n;
}


