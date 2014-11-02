var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

module.exports.load_route = function(router,fn){

    router.get(route_path, function*(next) {
        if(!this.body){
            this.body = route_path;
        }else{
            this.body += '\n'+route_path;
        }
        
        clog('render '+route_path);
        yield next;
    });
    fn();
}
