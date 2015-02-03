var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var str = g.u.str;
var db_app = f.db_app;
var gen_query = f.db_app.gen_query;

var route_path = f.get_route_path(__filename);

module.exports.load_menu = function(fn){
    var menu_item = {};
    menu_item.link = route_path;
    menu_item.name = 'администрирование';
    
    fn(null,menu_item);
}


var render = {}
render.user = {};
render.user.list = function*(ctx,next){
    var query = "SELECT idc AS id,name,login FROM t_user WHERE 1=1";
    var rows = yield gen_query(query);
    
    var rend_opt = { route_path:route_path, d:ctx.request.body, p:ctx.params, list:rows };
    rend_opt.template_file_path = __dirname;
    
    yield ctx.render('user.html',rend_opt);
    yield next;
}

module.exports.load_route = function(router,fn){
    fn();
    router.all(route_path+'/:table_name/:oper_type',function*(next) {
        var p = this.params;
        
        var f_table = render[p.table_name];
        if (!f_table) return yield next;
        
        var f_oper = f_table[p.oper_type];
        if (!f_oper) return yield next;
        
        yield f_oper(this,next);
        
        yield next;
    });
    router.get(route_path, function*(next) {
        yield this.render('admin.html',{ route_path:route_path, d:this.request.body, p:this.params });
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


