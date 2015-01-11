'use strict';
console.log('  load app/app_load/render_html_menu_file.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;
var fnc = {};

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports = g.co(function *(file_path,menu_list){
    var exists = yield f.fs.gen_exists(file_path);
    if (!exists) {
        yield tf(f.fs.check_directory)(g.path.dirname(file_path));
    }
    
    
});
