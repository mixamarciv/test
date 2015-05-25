'use strict';
console.log('load .../js/db_fncs.js');

var g = require('../inc.js');
var fnc = g.functions;
var fs = g.fs;
var fs2 = g.functions.fs;
var path = g.path;
var path_join = g.path.join2;
var tf = g.thunkify;
var c = g.config;
var clog = console.log;

var u = g.u;

var f = g.functions.db;
module.exports = f;

f.load_db_list = load_db_list;



//загружаем список бд из каталога from_path в to_object
function* load_db_list(from_path,to_object) {
    var files = yield fs2.gen_readdir(from_path);
    to_object.map = {};
    to_object.arr = [];
    
    for(var i=0;i<files.length;i++){
        //clog(g.mixa.dump.var_dump_node('to_object',to_object,{max_str_length:90000,exclude:[]}));
        c.db.default_conn_options.info = {};
        var p_path = path_join(from_path,files[i]);
        var db = yield check_and_load_db_config(p_path,files[i]);
        if (db) {
            to_object[files[i]] = db;
            to_object.arr.push(db);
            to_object.map[files[i]] = db;
            if (db.info && db.info.id) {
                to_object.map[db.info.id] = db;
                to_object[db.info.id] = db;
            }
        }
    }
    //clog(files);
}

function* check_and_load_db_config(p_path,name) {
    var database = path_join(p_path,'DATA.FDB');
    var b = yield fs2.gen_exists(database);
    var db = 0;
    if (b) {
        //var name = path.basename(p_path);
        db = {test:0};
        //clog(c.db.default_conn_options);
        u.defaults( db, c.db.default_conn_options ) ;
        //clog(c.db.default_conn_options);
        //u.extend( db, c.db.default_conn_options );
        db.database = database;
        
        var info_path = path_join(p_path,'info.js');
        var b = yield fs2.gen_exists(info_path);
        if (b) {
            db.info = yield get_info_from_file(info_path);
        }
        //clog(db);
        //clog(db);
        //if(!db.info.id) db.info.id = fnc.hash(name,'crc32');
        if(!db.info.id) db.info.id = fnc.hash(name,'crc32');
        db.info.id2 = name;
        if(!db.info.name) db.info.name = name;
        if(!db.info.description) db.info.description = database;
        
        //clog(' db['+name+'] '+database);
        //clog(db);
    }
    return db;
}

function* get_info_from_file(file) {
    var data = (yield fs2.gen_readfile(file)).toString();
    //clog(data);
    try{
        var info = fnc.eval(data);
    }catch(err){
        throw err;
        return err;
    }
    return info;
}

