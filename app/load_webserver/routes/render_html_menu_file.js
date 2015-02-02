'use strict';
console.log('  load app/load_webserver/load_routes/render_html_menu_file.js..');

var g = require('../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;
var fnc = {};

//загрузка роутов из всех поддиректорий g.config.scripts_path
module.exports = function *(file_path,menu_list){
    var exists = yield f.fs.gen_exists(file_path);
    if (!exists) {
        yield tf(f.fs.check_directory)(g.path.dirname(file_path));
    }
    
    var html = '';
    html += '<ul class="nav navbar-nav">\n';
    html += render_menu_html(menu_list);    
    html += '</ul>\n';
    html += '\n';
    
    /*html += '<ul class="nav navbar-nav navbar-right">\n';
    html += '   <li class="dropdown">\n';
    html += '   <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>\n';
      <ul class="dropdown-menu">

        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
  </ul>
    */
    yield tf(g.fs.writeFile)(file_path,html);
}

function render_menu_html(menu_list) {
    var html = '';
    for(var i=0;i<menu_list.length;i++){
        var item = menu_list[i];  //menu_item == {link: 'ссылка', name: 'название пункта меню', submenu: []}
        if (item.submenu && item.submenu.length > 0) {
		html += '<li class="dropdown">\n'+
                        //'<a href="'+item.link+'" class="dropdown-toggle" data-toggle="dropdown">'+item.name+'<b class="caret"></b></a>\n'+
                        '<a href="'+item.link+'">'+item.name+'<b class="caret"></b></a>\n'+
                        '<ul class="dropdown-menu">\n';
                html += render_menu_html(item.submenu);
                html += '</ul>\n';
                html += '</li>\n';
        }else{
		html += '<li><a href="'+item.link+'">'+item.name+'</a></li>\n';
        }
    }
    return html;
}

