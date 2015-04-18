var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

module.exports.load_menu = function(fn){
    var menu_item = {};
    menu_item.link = route_path;
    menu_item.name = 'запуск внешних процессов';
    
    fn(null,menu_item);
}

module.exports.load_route = function(router,fn){
    //router.redirect('/','/main');
    router.get(route_path, function*(next) {
        var users = [{name: 'Dead Horse'}, {name: 'Jack'}, {name: 'Tom'}];
        this.render('index.html', {users: users});
        yield next;
    });
    fn();
}
