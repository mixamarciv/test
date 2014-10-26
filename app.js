console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);

var g = require('./inc.js');
var f = g.functions;
var clog = console.log;

var app = require('koa')();

var load_app_use = require('./app/app_use/index.js');
load_app_use(app);


var sendfile = require('koa-sendfile');
//-----------------------------------------------------------
var Router = require('koa-router')

var public = new Router();

//public.post('/login', passport.authenticate('local', { successRedirect: '/secured', failureRedirect: '/failed'}) );
public.redirect('/','/main');

public.get('/main', function*(next) {
  this.body = 'Hello World main';
  clog('get main');
  yield next;
  //this.body += "hello world from " + this.request.url;
})

public.get('/1', function*(next) {
  this.body = 'Hello World1';
  clog('get 444');
  yield next;
  //this.body += "hello world from " + this.request.url;
})

public.get('/123', function*(next) {
  this.body = "hello world from " + this.request.url;
  clog('get 123');
  yield next;
})

public.get('/2', function*(next) {
  this.body = 'Hello World2';
  clog('get 2');
  var d = 0;
  var c = 100 / d;
  throw('aaaaa');
  //yield ;
  
  //this.body += "hello world from " + this.request;
})

public.get('/files/test.txt', function*(next) {
  var stats = yield* sendfile.call(this, g.path.join(__dirname,'/files/test.txt'));
  if (!this.status) this.throw(404)
  //yield ;
  
  //this.body += "hello world from " + this.request;
})


public.get('/3', function*(next) {
  this.body = "hello world from " + this.request.url;
  clog('get 3');
  yield next;
})

app.use(public.middleware())
//-----------------------------------------------------------

require('kill-prev-process-app')({path:__dirname+'/temp/pid',wait:100},function(){
    // SSL options
    var ssl_options = {
      key: g.fs.readFileSync('./keys/server.key'),
      cert: g.fs.readFileSync('./keys/server.crt')
    }
    // start the server
    require('http') .createServer(app.callback()).listen(80);
    require('https').createServer(ssl_options, app.callback()).listen(443);
});
