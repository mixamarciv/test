var g = require('../../main_inc.js');
var fs = g.fs;
var path = g.path;
var tf = g.thunkify;
var c = g.config;
var clog = console.log;
var fnc = g.functions;

var f = {};
module.exports = f;


f.gen_connect = gen_connect;
f.query = query;
f.gen_query = gen_query;


//проверяем есть ли подключение к бд, если нет - создаем его, и возвращаем нужное подключение к бд
function* gen_connect(db_name) {
    if (g.data.db[db_name]){
	//db.gen_query = function(sql,params){
	//    return gen_query(db_name,sql,params);
	//}
	return g.data.db[db_name];
    }
    g.data.db[db_name] = yield tf(g.db.connect)(g.config.db[db_name]);
    return g.data.db[db_name];
}


function query(db_name,q,params,fn){
    if (!g.data.db[db_name]) {
	var err = new Error('not connected to db "'+db_name+'"');
	err = g.functions.merr(err);
	return fn(err);
    }
    g.data.db[db_name].query.apply(g.data.db[db_name].query,[q,params,fn]);
};

function* gen_query(db_name,sql,params){
    if (arguments.length>2) {
	return yield tf(query)(db_name,sql,params);
    }
    return yield tf(query)(db_name,sql);
};
