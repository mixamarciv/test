'use strict';
console.log('  load app/app_load/index.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;
var fnc = {};

//загрузка роутов из всех поддиректорий g.config.scripts_path
//а так же загрузка пунктов меню и создание временного html файла меню
module.exports = g.co(function *(app){
    
    //загрузка списка index.js файлов из подкаталогов g.config.scripts_path
    var list = yield tf(fnc.load_index_files_list)(g.config.scripts_path);
    
    //загрузка роутингов и других данных из списка index.js файлов
    yield tf(fnc.load_route_from_index_files)(app,list);
        
    //загрузка пунктов меню из списка index.js файлов
    yield tf(fnc.load_menu_from_index_files)(list);
    
    yield tf(require('./render_html_menu_file.js'))(g.config.temp_path+'/template/html/menu/main_menu.html',g.config.auto.menu);
    
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
        var cnt_err = 0;
        var errors = [];

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
                    e = f.merr(e,'ERROR: fail load_route() in file: '+route_file);
                    //console.log(g.util.inspect(e));
                    errors.push(e);
                    cnt_err++;
                }
            }
            
        }
        app.use(router.middleware());
        
        if (cnt_err) throw(errors);
    })(fn);
}

//загрузка пунктов меню из index.js файлов
//  меню задаются в этих файлах функуцией module.exports.load_menu()
//    menu_item == {link: 'ссылка', name: 'название пункта меню', submenu: []}
fnc.load_menu_from_index_files = function (list,fn) {
    g.co(function *(){
        var cnt_load_menu = 0;
        var cnt_err = 0;
        var errors = [];
        
        var menu_list = [];  //сюда загружаем набор пунктов меню из каждого index файла с функцией load_menu();
        var parent = {menu_item:null,route_file:null};
        
        for(var i=0;i<list.length;i++){
            var route_file = list[i];
            var fncs_file = require(route_file);
            
            var load_menu_fnc = fncs_file.load_menu;
            if (g.u.isFunction(load_menu_fnc)){
                console.info('    load_menu:  '+f.get_route_path(route_file));
                var is_error = 0;
                try{
                    var menu_item = yield tf(load_menu_fnc)();
                    menu_item._route_file = route_file;
                    
                    push_menu_item(menu_list,menu_item);
                    
                    cnt_load_menu++;
                } catch(e) {
                    is_error = 1;
                    e = f.merr(e,'ERROR: fail load_menu() in file: '+route_file);
                    //console.log(g.util.inspect(e));
                    errors.push(e);
                    cnt_err++;
                }
            }
        }
        //console.log(g.util.inspect(menu_list));
        menu_list.sort(sort_menu);
        //console.log(g.util.inspect(menu_list,{depth:10}));
        g.config.auto.menu = menu_list;
        
        if (cnt_err) throw(errors);
    })(fn);
}

function push_menu_item(menu_list,a) {
    if( !menu_list.length ){
        menu_list.push(a);
        return 1;
    }
    var b = 0;
    for(var i=0;i<menu_list.length;i++) {
        var m = menu_list[i];
        var p = is_parent_path(path.dirname(m._route_file),a._route_file);
        if ( p == 0 ) continue;
        if ( p > 0 ) {
            if ( !m.submenu ) m.submenu = [];
            b = push_menu_item(m.submenu,a);
            if ( b > 0 ) break;
        }
    }
    if ( b == 0 ) {
        menu_list.push(a);
        return 1;
    }
    return 0;
}

function is_parent_path(parent,c) {
    if (parent==c) return 0;
    var level = 1;
    while(1){
        var t = path.dirname(c);
        if (t == c) return 0;
        if (t == parent) return level;
        c = t;
        level++;
    }
    return 0;
}

var sort_i = 0;
function sort_menu(a,b) {
    sort_submenu(a);
    sort_submenu(b);
    
    if (a.n_order===undefined) a.n_order = Number.MAX_VALUE/2 + sort_i++;
    if (b.n_order===undefined) b.n_order = Number.MAX_VALUE/2 + sort_i++;
    if (a.n_order < b.n_order) return -1;
    if (a.n_order > b.n_order) return  1;
    return 0;
}

function sort_submenu(a) {
    if (a.submenu && g.u.isArray(a.submenu) && !a.submenu__sorted) {
        a.submenu__sorted = 1;
        a.submenu.sort(sort_menu);
    }
}

