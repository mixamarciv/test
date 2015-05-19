var g = require('../../main_inc.js');
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
    fs.exists(file,function(ex){
        fn(null,ex);
    });
});

f.gen_readdir = g.thunkify(function(path,fn){
    fs.readdir(path,fn);
});


f.gen_readfile = g.thunkify(function(file,fn){
    fs.readFile(file, function (err, data) {
      if (err) return fn(err);
      fn(null,data);
    });
});

