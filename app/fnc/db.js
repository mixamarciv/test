var g = require('../../inc.js');
var fs = g.fs;
var path = g.path;
var tf = g.thunkify;
var c = g.config;
var clog = console.log;

var f = {};
module.exports = f;


f.gen_connect = gen_connect;
f.query = query;
f.gen_query = gen_query;


function* gen_connect(db_name) {
    clog('BBBBBBBBBBB1');
    if (g.data.db[db_name]) return g.data.db[db_name];
    clog('BBBBBBBBBBB2');
    g.data.db[db_name] = yield tf(g.db.connect)(g.config.db[db_name]);
    clog('BBBBBBBBBBB3');
    return g.data.db[db_name];
}

function query(db_name,q,params,fn){
    g.data.db[db_name].query.apply(g.data.db[db_name].query,[q,params,fn]);
};

function* gen_query(db_name,q,params){
    if (arguments.length>2) {
	return yield tf(query)(db_name,q,params);
    }
    return yield tf(query)(db_name,q);
};
