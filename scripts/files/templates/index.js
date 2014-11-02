var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var sendfile = require('koa-sendfile');


var route_path = f.get_route_path(__filename);

module.exports.load_route = function(router,fn){

    router.get(route_path+'/:p_template_name/:file_name', function*(next) {
        if(!this.body){
            this.body = route_path;
        }else{
            this.body += '\n'+route_path;
        }
        var file = this.url;
        file = file.replace(/\?.*$/g,'');
        var is_exists = yield tf(g.fs.exists)(file);
        if (!is_exists){

            var tplt = g.config.templates.path[this.params.p_template_name];
            if (!tplt) { //если такой шаблон не существует
                return this.throw(404,'not found template: '+this.params.p_template_name);
            }
            
            var file_ext = g.path.extname(file);
            var base_name_file = g.path.basename(file,file_ext);
            
            var template_to_this_file = 
            if () {
                
            }
            
        }
        

        
        var stats = yield* sendfile.call(this, file);
        if (!this.status) this.throw(404);
    });
    fn();
}
