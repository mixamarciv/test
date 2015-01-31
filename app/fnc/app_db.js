var g = require('../../inc.js');
var fs = g.fs;
var path = g.path;
var tf = g.thunkify;
var c = g.config;
var clog = console.log;

var f = {};
module.exports = f;

f.query = query;
f.gen_query = gen_query;


function query(q,params,fn){
    g.data.db.app.query.apply(g.data.db.app.query,[q,params,fn]);
};

function* gen_query(q,params){
    if (arguments.length>1) {
	return yield tf(query)(q,params);
    }
    return yield tf(query)(q);
};

