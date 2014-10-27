console.log('  load app/app_use/ejs.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

var render = require('koa-ejs');

module.exports = function load_render(app){
    
    var locals = {
        version: '0.0.1',
        now: function () {
            return new Date();
        },
        ip: function *() {
            //yield wait(100);
            return this.ip;
        },
    };
    
    var filters = {
        format: function (time) {
            return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
        }
    };

    render(app, {
        root: g.config.templates_path,
        /*layout: 'template',*/
        viewExt: 'html',
        cache: false,
        debug: true,
        locals: locals,
        filters: filters,
        test: 0
    });

    
    //меняем функцию this.render для того что бы она искала файлы для рендеринга в каталоге options.render_path
    //  или в каталоге request.path(относительный путь к скрипту)
    app.use(function *(next) {
        this.render_ejs = this.render;
        this.render = function(file,options){
            if (!options.render_path){
                options.render_path = g.path.join( g.config.scripts_path, this.request.path);
            }
            return this.render_ejs( g.path.join(options.render_path, file), options );
        }
        yield next;
    });
    
    
}

