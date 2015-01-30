var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

var str = g.u.str;

module.exports.load_route = function(router,fn){
    fn();
    router.get(route_path, function*(next) {
        var user = this.locvars.user.get();
        yield this.render('login.html', {user: user});
        yield next;
    });
    router.post(route_path, function*(next) {
        var user = this.locvars.user.get();
        
        var d = this.request.body;
        var u = yield load_user(d);
        
        yield this.render('login.html', {d: d, u: u});
        yield next;
    });
    
}


function* load_user(d) {
    d.pass_login = str.trim(d.pass) + str.trim(d.login);
    
    var search_field = 'pass_login';
    if (/@.*\..+/.test(d.login)) search_field = 'pass_mail';
    clog('run query');
    //var rows = yield tf(run_query)("SELECT id,idc,name,login FROM t_user WHERE "+search_field+"='"+d.pass_login+"'");
    var rows = yield tf(run_query);
    clog(rows);
    return rows;
}

function run_query(fn) {
    var fb = require("node-firebird");
    
    clog('fb.attach');
    fb.attach(g.config.db['app'],function(err,db_conn){
        if (err) return fn(err);
        clog('db_conn.query');
        db_conn.query("SELECT 'test' AS test FROM rdb$database",function(err,data){
            clog('end run');
            clog(arguments);
            fn(err,data);
            clog('return data');
        });
    });

}
