var g = require('../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

var route_function = require('./main/main.js').route_function;

module.exports.load_route = function(router,fn){
    router.get(route_path, route_function);
    router.get('/', route_function);
    fn();
}
