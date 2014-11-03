console.log('  load app/app_use/error_404_and_500.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

module.exports = function *pageNotFound(next) {
    try {
        yield next;
    } catch(e) {
        e = f.merr(e);
        var error_info = '';
        if (e.messages && g.u.isArray(e.messages)) {
            error_info = e.messages.join('\n\n');
        }
        this.status = e.status;
        if (!this.status) this.status = 500;
        
        var message = 'internal server error';
        if (this.status == 404)  message = 'file not found';
        
        switch (this.accepts('html', 'json')) {
          case 'html':
              this.type = 'html';
              this.body = '<h1>'+this.status+'</h1><p>' + message + '</p><pre>\n'+error_info+'</pre>';
              break;
          case 'json':
              this.body = {
                status: this.status,
                message: message,
                error_info: error_info
              };
              break;
          default:
              this.type = 'text';
              this.body = message + '\n\n\n' + error_info;
        }
        return;
    }
    
    if (404 != this.status) return;
    switch (this.accepts('html', 'json')) {
        case 'html':
            this.type = 'html';
            this.body = '<h1>404</h1><p>Page Not Found</p><br>url:'+this.request.url;
            break;
        case 'json':
            this.body = {
              message: 'Page Not Found'
            };
            break;
        default:
            this.type = 'text';
            this.body = 'Page Not Found';
    }
}

