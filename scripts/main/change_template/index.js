var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

module.exports.load_route = function(router,fn){
    //router.redirect('/','/main');
    var all_t = g.config.templates.names;
    router.get(route_path, function*(next) {
        var cur_t = this.cookies.get('template_main');
        var new_t = all_t[0];
        {
            var need_i;
            for(var i=0; i < all_t.length; i++){
                var t = all_t[i];
                if (t == cur_t) {
                    need_i = i+1;
                    break;
                }
            }
            if (need_i >= all_t.length) need_i = 0;
            new_t = all_t[need_i];
        }
        this.cookies.set('template_main',new_t);
        var cur_t2 = this.cookies.get('template_main');
        this.render('index.html', {new_template: new_t,cur_t2:cur_t2});
        yield next;
    });
    fn();
}
