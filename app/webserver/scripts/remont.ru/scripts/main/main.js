var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

module.exports.route_function = route_function;
module.exports.load_route = function(router,fn){
    //router.redirect('/','/main');
    router.get(route_path, route_function);
    fn();
}

function *route_function(next) {
    var data = {
            page_title: 'ремонт ПК и заправка картриджей в рашке в городе Инта',
            template_file_path: __dirname,
            test: 1
        };
    yield this.render('main.html', data);
    yield next;
}
