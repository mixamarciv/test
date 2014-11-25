console.log('load database connect..');


//var g  = require('../../app.js');
var g = require('../global.js');
var cfg = g.app_config;
var a = g.app_fnc;

var fb = require("node-firebird");

/**
//-------------------------------------------------------------
var db_conn_config = {
    database: path_join( __dirname, './data.fdb' ) ,
    host: '127.0.0.1',     // default
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey', // default
    role: null,            // default
    pageSize: 4096,        // default when creating database
    table_prefix: ""
};

var db = require('db');
db.connect('ibase',function(err,connect){
    if(err) trow(err);
    connect.query('SELECT * FROM table'[,options],function(err,rows){
        if(err) trow(err);
        console.log(rows);
    });
    connect.generator(gen_name[,inc_val],function(err,gen_id){
        if(err) trow(err);
        console.log('next id:'+gen_id);
    });
});

var str = "SELECT name,text,tags FROM app1_post WHERE id_post="+post.id;
req.db.query(str,function(err,rows){
      if(err){
        err.sql_query_error = str;
        return fn(err_info(err,'sql query: get post data'));
      }
      if (rows.length==0){
        err = new Error();
        err.sql_query_norows = str;
        return fn(err_info(err,'sql query: post not found (id_post:'+post.id+')'));
      }
      
      var row = rows[0];

      post.name = row.name;
      post.text = row.text;
      post.tags = row.tags;
      
      post.text = prepare_text(post.text);
      
      fn(null,post);
});

//-------------------------------------------------------------
**/

//module.exports = db_functions;

module.exports.create_db_connect = function(p_connect_options){
    return new firebird_database_functions(p_connect_options);
}

module.exports.connect = firebird_database_functions;

function firebird_database_functions(p_db_conn_config) {
    var db_conn_config = g.u.clone(p_db_conn_config);
    
    if (!db_conn_config.name) {
        db_conn_config.name = db_conn_config.host+":"+db_conn_config.database;
    }
    
    var db_functions = {};
    var db_conn = {is_connected:0};
    var db_ready_functions_list = [];      //функции выполняется при установке подключения к бд
    var db_ready_function = function(err){
        for(var i=0;i<db_ready_functions_list.length;i++) {
            var fn = db_ready_functions_list[i];
            fn(err);
        }
        db_ready_functions_list = [];
    };  
    
    fb.attach(db_conn_config,function(err,p_db_conn){
        if (err) {
            g.log.error("connect to DB "+db_conn_config.name+" error:");
            g.log.dump_error("db_conn_config",db_conn_config);
            g.log.dump_error("err",err);
            db_ready_function(err);
            return 0;
        }
        db_conn = p_db_conn;
        db_conn.is_connected = 1;

        g.log.info("connect to DB "+db_conn_config.name+" complete )");
        db_ready_function();
    });
    
    db_functions.on_ready = function(fn){
        if (db_conn.is_connected){
            return fn();
        }else{
            db_ready_functions_list.push(fn);
        }
    }
    
    db_functions.get_conn = function(fn){
        db_functions.on_ready(function(){
            return fn(null, db_conn);
        });
    }
    
    db_functions.query = function query(query_str,result_function/*(err,rows)*/,options){
        db_conn.query(query_str,function(err,rows){
            if (err) {
                err.query = query_str;
                //err.stack = new Error().stack;
                g.log.error("query to DB "+db_conn_config.name+" error:");
                g.log.dump_error("db_conn_config",db_conn_config);
                g.log.dump_error("err",err);
                g.log.error("query_str ("+query_str.length+") = \n"+query_str);
                return result_function(err);
            }
            result_function(null,rows);
        });
    }
    
    db_functions.close = function close(){
        db_conn.disconnect();
        return 1;
    }
    

    db_functions.generator = function generator(gen_name,inc_val,result_function){
        var query_str = "SELECT gen_id("+gen_name+","+inc_val+") AS new_id FROM rdb$database";
        db_conn.query(query_str,function(err,rows){
            if (err) {
                err.query = query_str;
                err.stack = new Error().stack;
                g.log.error("generator query to DB "+db_conn_config.name+" error:");
                g.log.dump_error("err",err);
                g.log.error("generator query_str("+query_str.length+") = \n"+query_str);
                return result_function(err);
            }
            var id = rows[0].new_id;
            result_function(null,id);
        });
    }
    
    return db_functions;
}