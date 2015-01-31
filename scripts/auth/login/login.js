var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

var str = g.u.str;
var db_app = f.db_app;
var gen_query = f.db_app.gen_query;

module.exports.load_route = function(router,fn){
    fn();
    router.get(route_path, function*(next) {
        var d = {login:'',pass:''};
        yield this.render('login.html', {d: d});
        yield next;
    });
    router.post(route_path, function*(next) {
        var user = this.locvars.user.get();
        
        var d = this.request.body;
        var u = yield load_user(d);
        
        if (!u.error) this.locvars.user.set(u);
        
        yield this.render('login.html', {d: d, u: u});
        yield next;
    });
    
}


function* load_user(d) {
    if (str.trim(d.login).length==0) return {error:'нужно указать логин или емеил'};
    if (str.trim(d.pass ).length==0) return {error:'нужно указать пароль'};

    d.pass_login = str.trim(d.pass) + str.trim(d.login);
    
    var search_field = 'pass_login';
    if (/@.*\..+/.test(d.login)) search_field = 'pass_mail';
    
    var query = "SELECT idc AS id,name,login FROM t_user WHERE "+search_field+"=?";
    var rows = yield gen_query(query,[d.pass_login]);
    if (!rows || rows.length==0) return {error:'не верный логин/емеил пароль'};
   
    var u = rows[0];
    u.id = u.id.toString();
    u.name = u.name.toString();
    u.login = u.login.toString();
   

    return u;
}


