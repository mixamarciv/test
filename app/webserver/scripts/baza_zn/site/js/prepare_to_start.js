'use strict';
console.log('load prepare_to_start.js');

var g = require('../inc.js');
var fnc = g.functions;
var c = g.config;

module.exports.load_db_list = load_db_list;


function load_db_list(fn) {
    fnc.run_gen(function*(){
        
        //yield fnc.gen_wait(1000);
        console.log('load_db_list begin:');
        
        var db_paths = c.db.default_conn_options.database;
        var b = yield g.db_fncs.load_db_list(db_paths,c.db);
        
        
        console.log('load_db_list end');
    },function(err){
        if (err) {
            console.log(fnc.merr(err));
            return fn(err);
        }
        fn();
    });
}


    

