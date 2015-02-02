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


function* gen_connect() {
    if (g.data.db.app) return g.data.db.app;
    g.data.db.app = yield tf(g.db.connect)(g.config.db['app']);
    return g.data.db.app;
}

function query(q,params,fn){
    g.data.db.app.query.apply(g.data.db.app.query,[q,params,fn]);
};

function* gen_query(q,params){
    if (arguments.length>1) {
	return yield tf(query)(q,params);
    }
    return yield tf(query)(q);
};

