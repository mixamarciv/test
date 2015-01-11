var g = require('../../inc.js');
var cerr = console.error;
var clog = console.log;

var fnc = {};
module.exports = fnc;

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
      err = new Error('undefined error3000');
    }
    var info = g.util.inspect(err.stack).replace(/(\\\\)/g,'\\').replace(/\\n\s*at/g,'\n    at');
    if (!msg) msg = '';
    else msg += '\n';
    var imsg = msg + info;
    if (!err.messages) err.messages = [imsg];
    else err.messages = [imsg].concat(err.messages);
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


//функция ожидающая создания файла file
//options.timeout - таймаут между проверками файла
//options.cnt     - количество проверок до прерывания проверок
fnc.wait_for_file = function(file,options,fn){
    if (!fn){
      fn = options;
      options = {timeout:100,cnt:10};
    }
    if (!options.timeout || options.timeout<=0) options.timeout = 100;
    if (!options.cnt     || options.cnt<=0    ) options.cnt = 10;
    g.co(function *(){
        var t = options.cnt;
        var exists = 0;
        while (t-->0) {
            exists = yield fnc.fs.gen_exists(file);
            if (exists) break;
            //clog('wait '+(new Date()).getTime());
            var b = yield fnc.gen_setTimeout(options.timeout);
        }
        return exists;
    })(function(err,ret_exists){
      //clog('ret('+ret+') exists == '+exists);
      if (err) return fn(err);
      if (!ret_exists) return fn(fnc.merr(err,'file not exists'));
      fn(null);
    });
};

fnc.render_css = require('./render_css.js');
fnc.render_js  = require('./render_js.js');
