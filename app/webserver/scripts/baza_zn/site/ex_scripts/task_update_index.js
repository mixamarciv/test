'use strict';
console.log('load task_update_index.js');

var g = require('../inc.js');
var fnc = g.functions;
var c = g.config;
var tf = g.thunkify;


module.exports = function(fn){
    fnc.run_gen(function*(){
        yield fnc.gen_wait(1000);
        console.log('task_update_index begin:');
        //var load_db_list = require('../prepare_to_start.js').load_db_list;
        //yield tf(load_db_list)();
        yield fnc.gen_wait(5000);
        yield fnc.gen_wait(5000);
        console.log('task_update_index end');
    },function(err){
        if (err) {
            console.log(fnc.merr(err));
            return fn(err);
        }
        fn();
    });
}
