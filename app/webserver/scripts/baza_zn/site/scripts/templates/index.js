var g = require('../../inc.js');
var c = g.config;
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var path_join = g.path.join;
var basename  = g.path.basename;
var extname   = g.path.extname;

var sendfile = g.koa_sendfile;

var route_path = f.get_route_path(__filename);


module.exports.load_route = function(router,fn){

    router.get(route_path+'/:p_template_name/:file_name', function*(next) {
        
        var main_path = c.temp_path;
        var file = this.url;
        file = file.replace(/\?.*$/g,'');
        var full_path_to_file = path_join(main_path,file);
        var is_exists = yield f.fs.gen_exists(full_path_to_file);
        if (!is_exists) {

            var template_path = c.auto.templates.path[this.params.p_template_name];
            if (!template_path) { //если такой шаблон не существует
                return this.throw(404,'not found template: '+this.params.p_template_name+' (debug info:'+g.util.inspect(c.auto.templates.path)+')');
            }
            
            var file_ext = extname(file);
            var ext = file_ext.substring(1);
            var base_name_file = basename(file,file_ext);
            var template_for_this_file = path_join(template_path,ext,base_name_file+'.js');
            is_exists = yield f.fs.gen_exists(template_for_this_file);
            if (!is_exists) {
                return this.throw(404,'not found template file: '+template_for_this_file);
            }
            clog(template_for_this_file);
            var render_file = require(template_for_this_file);
            try{
                yield render_file(full_path_to_file);
            }catch(e){
                e = f.merr(e,'render file error in '+ template_for_this_file );
                return this.throw(e);
            }
        }
        
        yield g.koa_send(this, full_path_to_file, { maxage: 1000*60*60*24*364 });

        yield next;
    });
    fn();
}
