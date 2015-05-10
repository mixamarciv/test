var g = require('../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var files_path = g.path.join(__dirname,'../files');
module.exports.load_route = function(router,fn){
    router.get(/.*/g, function*(next){
        
        var p = this.originalUrl;
        p = p.replace(/\?.*$/,'');
        if (p=='/' || p=='') {
            p = 'index.html';
        }
        var f = g.path.join(files_path,p);
        
        var ex = [/^this.socket/,/^this.res/,/^this.req.socket/,/^this.req.connection/,/^this.req.client/];
        //clog(g.mixa.dump.var_dump_node('this.response',this.response,{max_str_length:90000,exclude:[]}));
        
        
        yield g.koa_send(this, f, { maxage: 1000*60*60*24*364 });
        yield next;
        
        //this.response.header['content-security-policy'] = '';
        //delete this.response.header['content-security-policy'];
    });
    fn();
}
