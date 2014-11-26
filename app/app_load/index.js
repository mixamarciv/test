console.log('  load app/app_load/index.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var fnc = {};

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports = g.co(function *(app){
    
    //загрузка списка index.js файлов из подкаталогов g.config.scripts_path
    var list = yield tf(fnc.load_index_files_list)(g.config.scripts_path);
    
    //загрузка роутингов и других данных из списка index.js файлов
    yield tf(fnc.load_route_from_index_files)(app,list);
    
});


//загрузка списка index.js файлов из всех поддиректорий path
fnc.load_index_files_list = function (path,fn){
    g.co(function *(){
        var list = [];
        function *update_list_route_files(ppath,level) {
            if (!level) level = 0;
            var dir = yield tf(g.fs.readdir)(ppath);
            for(var i=0;i<dir.length;i++){
                var file = dir[i];
                var file_path = g.path.join2(ppath,file);
                var stat = yield tf(g.fs.stat)(file_path);
                if (stat.isDirectory()) {
                    yield update_list_route_files(file_path,level+1);
                }else if ( file == 'index.js') {
                    list.push(file_path);
                }
            }
            if (level==0) {
                //сортируем получившийся список
                list.sort(function(a,b){
                    if (a.length>b.length) return 1;
                    if (a > b) return 1;
                    if (b < a) return -1;
                    return 0;
                });
            }
        }
        
        try {
            //загружаем список всех index.js файлов из g.config.scripts_path
            yield update_list_route_files(path);
            //console.log(list);
        } catch(e) {
            e = f.merr(e,'ОШИБКА: загрузки списка index.js файлов');
            //console.log(g.util.inspect(e));
            throw(e);
        }
        return list;
    })(fn);
}


//загрузка списка index.js файлов из всех поддиректорий path
fnc.load_route_from_index_files = function (app,list,fn){
    g.co(function *(){
        var Router = require('koa-router');
        var router = new Router();
        var cnt_load_route = 0;
        var cnt_load_menu = 0;
        var cnt_err = 0;
        var errors = [];
        
        var menu_list = [];  //сюда загружаем набор пунктов меню из каждого index файла с функцией load_menu();
        
        for(var i=0;i<list.length;i++){
            var route_file = list[i];
            var fncs_route_file = require(route_file);
            
            var load_route_fnc = fncs_route_file.load_route;
            if (g.u.isFunction(load_route_fnc)){
                console.info('    load_route: '+f.get_route_path(route_file));
                try{
                    yield tf(load_route_fnc)(router);
                    cnt_load_route++;
                } catch(e) {
                    e = f.merr(e,'ERROR: bad load_route in file: '+route_file);
                    //console.log(g.util.inspect(e));
                    errors.push(e);
                    cnt_err++;
                }
            }
            
            var load_menu_fnc = fncs_route_file.load_menu;
            if (g.u.isFunction(load_menu_fnc)){
                console.info('    load_menu:  '+f.get_route_path(route_file));
                try{
                    var menu_item = yield tf(load_menu_fnc)();
                    if(menu_item.n_order===undefined) menu_item.n_order = Number.MAX_VALUE;
                    menu_list.push(menu_item);
                    cnt_load_menu++;
                } catch(e) {
                    e = f.merr(e,'ERROR: bad load_menu in file: '+route_file);
                    //console.log(g.util.inspect(e));
                    errors.push(e);
                    cnt_err++;
                }
            }
        }
        app.use(router.middleware());
        set_main_menu(menu_list);
        if (cnt_err) throw(errors);
    })(fn);
}

function set_main_menu(menu_list) {
    menu_list.sort(function(a,b){
        if (a.n_order < b.n_order) return -1;
        if (a.n_order > b.n_order) return  1;
        return 0;
    });
    g.config.auto.menu = menu_list;
}