var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

//функция для вывода ошибок обработки запросов
//пример:
//  yield this.catch_error(404,'page not found');
//  yield this.catch_error(new Error());
module.exports.catch_error = function*( e, message) {
    if ( e instanceof Error ){
        e = f.merr(e,message);
        if (!g.u.isNumber(e.status)) {
            e.status = this.status;
        }
        
        if (message instanceof String) {
            e.message = message;
        }else
        if(!e.message){
            e.message = 'internal server error';
            if (e.status == 404)  e.message = 'not found';
        }
    }else if(g.u.isNumber(e)){
        this.status = e;
        e = {status:e,message:message,messages:[]};
    }else{
        var a = f.merr(new Error());
        a.debug = arguments;
        a.status = 500;
        e = a;
    }
    if (!e.messages) e.messages = [];
    if (e.status!=404) e.status = 500;
    
    switch (this.accepts('html', 'json')) {
      case 'html':
          yield this.render(e.status+'.html',{e:e,template_file_path:g.path.join(__dirname,String(e.status))});
          break;
      case 'json':
          this.body = {
            status: e.status,
            message: e.message,
            error_info: e.messages
          };
          break;
      default:
          this.type = 'text';
          this.body = e.status+': '+message +'\n\n\n'+e.messages.join('\n');
    }
    this.status = e.status;
}
