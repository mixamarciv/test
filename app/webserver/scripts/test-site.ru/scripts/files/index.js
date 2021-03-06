var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
//var sendfile = require('koa-sendfile');

var route_path = f.get_route_path(__filename);

module.exports.load_route = function(router,fn){

    var favicon_path = g.path.join( g.config.files_path, 'favicon.ico');
    router.get('/favicon.ico', function*(next){
        yield g.koa_send(this, favicon_path, { maxage: 1000*60*60*24*364 });
        yield next;
    });
    
    router.get(route_path, function*(next){
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
