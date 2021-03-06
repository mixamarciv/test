console.log('  load app/webserver/app_use/ejs.js..');

var g = require('../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var c = g.config;

var ect = require('ect');
var renderer = {};

module.exports = function load_render(app){
    
    //задаем настройки рендера
    renderer = ect({
        watch: c.templates.watch, // — Automatic reloading of changed templates,
                       //defaulting to false (useful for debugging with enabled cache,
                       //not supported for client-side)
        root: c.templates.main_path, //этот параметр не используется
        cache: c.templates.cache, // — Compiled functions are cached, defaulting to true
        test : 1,
    });
    
    //получаем список шаблонов
    c.auto.templates.path  = get_templates_obj();
    c.auto.templates.names = g.u.keys(c.auto.templates.path);
    
    //меняем функцию this.render
    app.use(function *(next) {
        this.render = render_ect;
        yield next;
    });
    
}


function *render_ect(file,options) {
    // ищем файлы для рендеринга в каталоге options.template_file_path
    // или в каталоге request.path(относительный путь к скрипту)
    if (!options) options = {};
    
    var all_templates = g.config.auto.templates.path;
    var all_templates_names = g.config.auto.templates.names;
    
    options.g = g;
    options.locvars = this.locvars;
    options.session = this.session;
    options.get_execute_time = get_execute_time;
    
    
    if (!options.template_file_path){
        // елси путь к файлу шаблона не задан, то задаем его относительно пути запроса
        options.template_file_path = g.path.join( g.config.scripts_path, this.request.path);
    }
    if (!options.template_main || !options.template_main_path){
        // елси путь к основному шаблону не задан
        
        var user_template_main = this.cookies.get('template_main');
        if (!user_template_main){
            if (options.template_main){
                user_template_main = options.template_main;
            }else{
                user_template_main = all_templates_names[0];
            }
            this.cookies.set('template_main',user_template_main);
        }
        options.template_main = user_template_main;
        options.template_main_path = all_templates[options.template_main];
    }
    
    var path_render_file = g.path.join2(options.template_file_path, file);
    
    
    options._this = this;
    options.all_vars = options;
    this.body = yield tf(run_render)( path_render_file, options);
    //this.body = run_render( path_render_file, options);
    //this.body = renderer.render( path_render_file, options);
}

function run_render(file,opt,fn) {
    //clog(arguments);
    renderer.render(file,opt,function(err,html){
        if (err) return fn(err);
        fn(null,html);
    });
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
    var ex = g.fs.existsSync(c.templates.main_path);
    {
        if (!ex) {
            console.error('ERROR: path c.templates.main_path="'+c.templates.main_path+'" not found!');
            return ret;
        }
        var list = g.fs.readdirSync(c.templates.main_path);
        for(var i=0;i<list.length;i++){
            var path = list[i];
            var full_path = g.path.join2(c.templates.main_path,path);
            var s = g.fs.statSync(full_path);
            if (!s.isDirectory()) continue;
            var test_path = g.path.join(full_path,'html');
            s = g.fs.statSync(test_path);
            if (!s.isDirectory()) continue;
            ret[path] = full_path;
        }
    }
    return ret;
}
