var g = require('../../inc.js');
var cerr = console.error;
module.exports = fnc = {};

fnc.die =
function die() {
  for(i=0;i<arguments.length;i++){
      console.error(arguments[i]);
  }
  process.exit(1);
}


fnc.merr =
function add_message_to_error(err,msg) {
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

//генератор для fs.exists
fnc.gen_fs_exists = g.thunkify(function(file,fn){
    g.fs.exists(file,function(ex){
        fn(null,ex);
    });
});
