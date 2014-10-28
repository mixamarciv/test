console.log('  load app/app_use/ejs.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

var render = require('koa-ejs');

module.exports = function load_render(app){
    
    var ect = require('ect');
    var renderer = ect({
        watch: true, // — Automatic reloading of changed templates,
                       //defaulting to false (useful for debugging with enabled cache, not supported for client-side)
        root: g.path.join( g.config.templates_path, '/default'),
        cache: true, // — Compiled functions are cached, defaulting to true
        test : 1,
    });
    
    
    //меняем функцию this.render для того что бы она искала файлы для рендеринга в каталоге options.template_file_path
    //  или в каталоге request.path(относительный путь к скрипту)
    app.use(function *(next) {
        this.render_ejs = this.render;
        this.render = function(file,options){
            if (!options.template_file_path){
                options.template_file_path = g.path.join( g.config.scripts_path, this.request.path);
            }
            this.body = renderer.render( g.path.join2(options.template_file_path, file), options);
            //return this.render_ejs( g.path.join(options.render_path, file), options );
        }
        yield next;
    });
    
    
}

