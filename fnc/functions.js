var g = require('../inc.js');
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
    if (!err.message) err.message = [msg];
    else err.message = [msg].concat(err.message);
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
