var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var route_path = f.get_route_path(__filename);

var url = require('url');

module.exports.route_function = route_function;
module.exports.load_route = function(router,fn){
    //router.redirect('/','/main');
    router.get(route_path, route_function);
    fn();
}

function *route_function(next) {
    var params = url.parse(this.originalUrl,true).query;
    if (!this.request.params) {
        this.request.params = params;
    }else{
        g.u.extend(this.request.params,params);
    }
    
    var data = {
            params: params,
            page_title: 'поиск по базе данных на сайте в рашке.com',
            template_file_path: __dirname,
            test: 1
    };
    
    if (params.db) { //проверяем существует ли выбранная бд
        var db = g.config.db.map[params.db];
        if (!db) {
            data.error = 'БД: "'+params.db+'" не найдена!';
            params.db = null;
        }else{
            data.db = db;
        }
    }
    
    if (!params.db) { //если бд не выбрана(или не существует)
        yield this.render('select_db.html', data);
        return yield next;
    }
    
    yield load_db_data.call(this,data,next);
}


function* load_db_data(data,next) {
    yield this.render('main.html', data);
    yield next;
}
