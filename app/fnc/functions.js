var g = require('../../main_inc.js');
var cerr = console.error;
var clog = console.log;

var util = require('util');

var fnc = {};
module.exports = fnc;

fnc.run_gen = function(fn){
  return g.thunkify(g.co(fn));
}


fnc.run_gen = function(fn_gen,fn_callback){ //my run generator wrap
  g.co(fn_gen).then(function(val){
      fn_callback(null,val);
  },function(err){
      fn_callback(err);
  });
}

//my thunkify function with promise
fnc.tf = function(f){  
    return function(){
        var args = [];
        for(var i=0;i<arguments.length;i++) args[i] = arguments[i];
        var p = new Promise(function (resolve, reject) {
            args.push(function(err){
                if (err) return reject(err);
                var p = [];
                for(var i=1;i<arguments.length;i++) p[i-1] = arguments[i];
                resolve.apply(null,p);
            });
            f.apply(null,args);
        });
        return p;
    }
}

fnc.wait = function(time,fn) {
  setTimeout(fn,time);
}


fnc.random_int = g.mixa.int.get_random_int;

fnc.fs = require('./fs.js');

fnc.die =
function die() {
  for(i=0;i<arguments.length;i++){
      console.error(arguments[i]);
  }
  process.exit(1);
}


fnc.merr =
function add_message_to_error(err,msg) {
    if (!err) {
      err = new Error(msg);
    }
    
    var info = err.stack;
    info = g.util.inspect(info).replace(/(\\\\)/g,'\\').replace(/\\n[\s]+at/g,'\n    at')
    
    if (!msg) msg = '';
    else msg += '\n';
    var imsg = msg + info;
    if (!err.messages) err.messages = [imsg];
    else err.messages = [imsg].concat(err.messages);
    
    
    err.toString = function(){
      return g.mixa.dump.var_dump_node('error',this,{max_str_length:90000});
    }
    return err;
}


fnc.readJsonSync =
function readJsonSync(jsonFile,showErrors){
  if (!g.fs.existsSync(jsonFile)){
    if(showErrors) cerr('ERROR: file not found "'+jsonFile+'"');
    return null;
  }
  
  var data = '';
  try{
    data = g.fs.readFileSync(jsonFile);
  }catch(e){
    if(showErrors) cerr('ERROR: cant read file "'+jsonFile+'"');
    return null;
  }
  
  data = g.u.str.trim(data);
  if (data.length==0) {
    if(showErrors) cerr('ERROR: cant read file "'+jsonFile+'"');
    return null;
  }
  
  try{
    data = JSON.parse(data);
  }catch(e){
    if(showErrors) cerr('ERROR: bad json data in file "'+jsonFile+'"');
    return null;
  }
  
  return data;
}

//получаем route_path из полного пути к route_file относительно пути к g.config.scripts_path
fnc.get_route_path =
function get_route_path(route_file) {
  var p = g.path.dirname(g.path.relative(g.config.scripts_path,route_file));
  p = p.replace(/\\/g,'/');
  p = p.replace(/\.\.\//g,'/');
  p = '/'+p;
  p = p.replace(/\/\//g,'/');
  return p;
}


//генератор для setTimeout
fnc.gen_setTimeout = g.thunkify(function(timeout,fn){
    setTimeout(function(){
        //clog(' timeout '+(new Date()).getTime());
        fn(null,1);
    },timeout);
});
fnc.gen_wait = fnc.gen_setTimeout;


//функция ожидающая создания файла file
//options.timeout - таймаут между проверками файла
//options.cnt     - количество проверок до прерывания проверок
fnc.wait_for_file = function(file,options,fn){
    //console.log('wait_for_file..');
    if (!fn){
      fn = options;
      options = {timeout:100,cnt:10};
    }
    if (!options.timeout || options.timeout<=0) options.timeout = 100;
    if (!options.cnt     || options.cnt<=0    ) options.cnt = 10;
    fnc.run_gen(function *(){
        var t = options.cnt;
        var exists = 0;
        while (t-->0) {
            exists = yield fnc.fs.gen_exists(file);
            if (exists) break;
            //clog('wait '+(new Date()).getTime());
            var b = yield fnc.gen_setTimeout(options.timeout);
        }
        return exists;
    },function(err,ret_exists){
      if (err){
        return fn(err);
      }
      if (!ret_exists){
        return fn(fnc.merr(err,'file not exists'));
      }
      fn(null);
    });
};


fnc.db_app = require('./db.js');
fnc.db = fnc.db_app;

fnc.render_css = require('./render_css.js');
fnc.render_js  = require('./render_js.js');


fnc.eval = function(script){
  var vm = require('vm');
  var sandbox = { };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  //console.log(util.inspect(sandbox));
  return sandbox;
}

fnc.hash = function(data,alg){
  if (!alg) alg = 'crc32';
  
  if (alg.substring(0,3)=='crc'){
    var a = g.crc[alg];
    var h = a(data).toString(16);
    return h;
  }
  var a = g.crypto.createHash(alg);
  a.update(data);
  var h = a.digest('hex');
  return h;
}
