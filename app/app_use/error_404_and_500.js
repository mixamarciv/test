console.log('  load app/app_use/error_404_and_500.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

module.exports = function *pageNotFound(next) {
    try {
        yield next;
    } catch(e) {
        e = f.merr(e);
        var error_info = e.messages.join('\n\n');
        this.status = 500;
        switch (this.accepts('html', 'json')) {
          case 'html':
              this.type = 'html';
              this.body = '<h1>500</h1><p>internal server error</p><pre>\n'+error_info+'</pre>';
              break;
          case 'json':
              this.body = {
                message: 'internal server error',
                error_info: error_info
              };
              break;
          default:
              this.type = 'text';
              this.body = 'internal server error\n\n\n' + error_info;
        }
        return;
    }
    
    if (404 != this.status) return;
    this.status = 404;
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

