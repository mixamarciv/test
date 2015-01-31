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
        var u = this.locvars.user.get();
        this.locvars.user.logout();
        yield this.render('logout.html', {u: u});
        yield next;
    });
}

