var g = require('../../base_inc.js');
var fs = g.fs;
var path = g.path;
var f = g.functions;
var c = g.config;
var clog = console.log;

var f = {};
module.exports = f;

module.exports.mkdir_path = g.mixa.path.mkdir_path;
module.exports.check_directory = g.mixa.path.check_directory;

//генератор для fs.exists
f.gen_exists = g.thunkify(function(file,fn){
    g.fs.exists(file,function(ex){
        fn(null,ex);
    });
});

