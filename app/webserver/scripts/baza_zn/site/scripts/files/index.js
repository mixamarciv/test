var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var c = g.config;
//var sendfile = require('koa-sendfile');
var path_join = g.path.join;

var route_path = f.get_route_path(__filename);

module.exports.load_route = function(router,fn){

    var files_path = g.config.files_path;
    var favicon_path = path_join( files_path, 'favicon.ico');
    router.get('/favicon.ico', function*(next){
        yield g.koa_send(this, favicon_path, { maxage: 1000*60*60*24*364 });
        yield next;
    });
    
    router.get(route_path+'/img/:file', function*(next){
        var file = this.params.file;
        var file_path = path_join(files_path,'/img/'+file);
        yield g.koa_send(this, file_path, { maxage: 1000*60*60*24*364 });
        yield next;
    });
    fn();
}
