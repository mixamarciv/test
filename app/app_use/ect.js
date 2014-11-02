console.log('  load app/app_use/ejs.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

var ect = require('ect');
var renderer = {};

module.exports = function load_render(app){
    
    //задаем настройки рендера
    renderer = ect({
        watch: g.config.templates.watch, // — Automatic reloading of changed templates,
                       //defaulting to false (useful for debugging with enabled cache,
                       //not supported for client-side)
        root: g.config.templates.main_path, //этот параметр не используется
        cache: g.config.templates.cache, // — Compiled functions are cached, defaulting to true
        test : 1,
    });
    
    //получаем список шаблонов
    g.config.templates.path  = get_templates_obj();
    g.config.templates.names = g.u.keys(g.config.templates.path);
    
    //меняем функцию this.render
    app.use(function *(next) {
        this.render = render_ect;
        yield next;
    });
    
}


function render_ect(file,options) {
    // ищем файлы для рендеринга в каталоге options.template_file_path
    // или в каталоге request.path(относительный путь к скрипту)
    if (!options) options = {};
    
    var all_templates = g.config.templates.path;
    var all_templates_names = g.config.templates.names;
    
    options.g = g;
    options.locvars = this.locvars;
    options.get_execute_time = get_execute_time;
    
    
    if (!options.template_file_path){
        // елси путь к файлу шаблона не задан, то задаем его относительно пути запроса
        options.template_file_path = g.path.join( g.config.scripts_path, this.request.path);
    }
    if (!options.template_main || !options.template_main_path){
        // елси путь к основному шаблону не задан
        if (options.template_main){
            options.template_main_path = all_templates[options.template_main];
            if (!this.session.template_main){
                this.session.template_main = options.template_main;
            }
        }else{
            if (!this.session.template_main){
                this.session.template_main = all_templates_names[0];
            }
            options.template_main = this.session.template_main;
            options.template_main_path = all_templates[options.template_main];
        }
    }
    
    this.body = renderer.render( g.path.join2(options.template_file_path, file), options);
}

//возвращает время загрузки
function get_execute_time() {
    var t = g.mixa.str.time_duration_str(this.locvars.start_load,new Date);
    return t;
}

//функция возвращает список доступных шаблонов (только если в каталоге есть подкаталог html)
//в виде: {'default':'/path/to/default','name':'/path/to/name'}
function get_templates_obj() {
    var ret = {};
    var list = g.fs.readdirSync(g.config.templates.main_path);
    for(var i=0;i<list.length;i++){
        var path = list[i];
        var full_path = g.path.join2(g.config.templates.main_path,path);
        var s = g.fs.statSync(full_path);
        if (!s.isDirectory()) continue;
        var test_path = g.path.join(full_path,'html');
        s = g.fs.statSync(test_path);
        if (!s.isDirectory()) continue;
        ret[path] = full_path;
    }
    return ret;
}
