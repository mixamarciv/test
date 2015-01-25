'use strict';
console.log('  load app/app_use/load_user_data_from_cookies.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

var clog_err = function(msg,err){
    if(!g.config.debug.load_user_data_from_cookies) return;
    console.error(msg);
    if (err) console.error(err);
}


module.exports = function(ths) {
    clog(ths.header);
    clog(ths.headers);
    ths.locvars.user = load(ths);
    
    ths.cookies.set( JSON.stringify(ths.locvars.user) ,{signed:true,maxAge:1000*60*60*24*30*12});
}

function load(self) {
    var data_req = self.cookies.get('user',{signed:true},null);
    var data_js  = null;
    try{
      data_js = JSON.parse(data_req);
    }catch(e){
      clog_err('ERROR: bad json in request cookie"'+data_req+'"',e);
    }
    if (!data_js) {
        return load_new_anonim_user(self);
    }
    return data_js;
}

var anonim_count = 0;
function load_new_anonim_user(self) {
    anonim_count++;
    var data = {
        login: 'anonymous'+anonim_count,
        name: 'anonymous'+anonim_count,
        start_session: self.session.start_time
    }
    return data;
}

//"{"login":"anonymous1","name":"anonymous1","start_session":"2015-01-25T13:11:18.210Z"}=[object Object]; path=/; secure; httponlytestsession=eyJzdGFydF90aW1lIjoiMjAxNS0wMS0yNVQxMzoxMToxOC4yMTBaIiwidmlld3MiOjMxfQ==; path=/; secure; httponlytestsession.sig=DO4pBvu_NGtyw-egzbQXTUM5WfU; path=/; secure; httponly"

//template_main=default; testsession=eyJzdGFydF90aW1lIjoiMjAxNS0wMS0yNVQxMzoxMToxOC4yMTBaIiwidmlld3MiOjI0fQ==; testsession.sig=SjvvRUT3DsVA_lPAGjQVThPDSEE
