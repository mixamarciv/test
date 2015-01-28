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

module.exports = function(ctx) {
    //clog(ths.header);
    var user = null; 
    ctx.locvars.user = {
        get: function() {
            if (!user) user = load(ctx);
            return user;
        },
        set: function(user) {
            save(ctx,user);
        },
        check_user_data: function(user) {
            check_user_data(user,0);
        }
    };
}

function check_user_data(user,opt) {
    if (!user) return 'user is not object';
    if (!user.id) return '!user.id';
    if (!user.login) return '!user.login';
    if (!user.name) return '!user.name';
    if (!user.start_session) return '!user.start_session';
    if (opt) {
        var ctx = opt.ctx;
        var user_str = JSON.stringify(user);
        var hash = enc_user_data(ctx,user_str);
        var user_hash = ctx.cookies.get('user_i');
        if (hash != user_hash) {
            if(!ctx.session.check_cookie_hash_error) ctx.session.check_cookie_hash_error = 1;
            else ctx.session.check_cookie_hash_error++;
            return '!user.check cookie hash ERROR(err cnt:'+ ctx.session.check_cookie_hash_error +')';
        }
    }
    return 0;
}
//"user.sig=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure;
//httponly
//user={"id":1,"login":"anonymous7","name":"Ð½Ðµ Ð°Ð²ÑÐ¾ÑÐ¸Ð·Ð¾Ð²Ð°Ð½(7)","start_session":1422281670451}; path=/; expires=Thu, 21 Jan 2016 14:14:41 GMT; secure;
//httponlyuser.sig=n74UixSAsO1r6R1_Ovz8y7ymwmw; path=/; expires=Thu, 21 Jan 2016 14:14:41 GMT; secure;
//httponlyuser_i=F1bh5UwXBEmNPcuRQ3Pu5WRvs4A=; path=/; expires=Thu, 21 Jan 2016 14:14:41 GMT; secure; httponlyuser_i.sig=tnI9-korV8htAoPUbVR6MMDfN1o;
//path=/; expires=Thu, 21 Jan 2016 14:14:41 GMT; secure;
//httponlytestsession=eyJzdGFydF90aW1lIjoiMjAxNS0wMS0yNlQxNDoxNDozMC40NTFaIiwidmlld3MiOjV9; path=/; secure;
//httponlytestsession.sig=8a8KgBaSsSFPNk_8PhAF3vHID6k; path=/; secure; httponly"

var anonim_s = '';
var anonim_count = 0;
function load_new_anonim_user(ctx) {
    anonim_count++;
    if (anonim_count > Number.MAX_VALUE-1000) {
        anonim_s = String(anonim_s) + String(anonim_count);
        anonim_count = 0;
    }
    var n = anonim_s + String(anonim_count);
    var data = {
        id: 1,
        login: 'anonymous'+n,
        name: 'anonymous('+n+')',
        start_session: new Date(ctx.session.start_time).getTime()
    }
    return data;
}

var bad_test = 0;
function save(ctx,user) {
    var bad_test = check_user_data(user,0);
    if (bad_test) throw(new Error('bad user data: '+bad_test));
    
    var s = JSON.stringify(user);
    ctx.cookies.set('user',s,{signed:true,maxAge:1000*60*60*24*30*12});
    ctx.cookies.set('user_i',enc_user_data(ctx,s),{signed:false,maxAge:1000*60*60*24*30*12});
    
    clog('== run_test '+bad_test+' =====================================================');
    if (bad_test++>3) {
        clog('== bad_test '+bad_test+' =====================================================');
        bad_test = 0;
        return;
    }
    var uuu = load(ctx);
    clog(g.util.inspect(uuu));
    clog('        -----------------------------------------------------');
    clog(g.util.inspect(user));
    clog('==/test =====================================================');
    
}

function load(ctx) {
    var data_req = ctx.cookies.get('user',{signed:true},null);
    clog(g.util.inspect(data_req));
    var user  = null;
    try{
      user = JSON.parse(data_req);
    }catch(e){
      clog_err('ERROR: bad json in request cookie "'+data_req+'"',e);
    }
    var bad_test = check_user_data(user,{ctx:ctx});
    if (bad_test){
        user = load_new_anonim_user(ctx);
        save(ctx,user);
        return user;
    }
    return user;
}

function enc_user_data(ctx,user_str) {
    var str = user_str + ctx.headers['user-agent'];
    var sha1 = g.crypto.createHash('sha1');
    sha1.update(str);
    var hash = sha1.digest('base64');
    return hash;
}

