console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);

var g = require('./inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;

var app = require('koa')();

//задаем настройки приложения
require('./app/app_use/index.js')(app);

//задаем пользовательские параметры роутинга:
/*******
var router = new require('koa-router')();
var user_scripts = g.path.join(g.config.scripts_path,'index.js');
require(user_scripts)(router);
app.use(router.middleware());
********/

//загрузка роутов из всех поддиректорий g.config.scripts_path
g.co(function *(){
    
    var list = [];
    function *update_list_route_files(ppath,level) {
        if (!level) level = 0;
        var dir = yield tf(g.fs.readdir)(ppath);
        for(var i=0;i<dir.length;i++){
            var file = dir[i];
            var file_path = g.path.join2(ppath,file);
            var stat = yield tf(g.fs.stat)(file_path);
            if (stat.isDirectory()) {
                yield update_list_route_files(file_path,level+1);
            }else if ( file == 'index.js') {
                list.push(file_path);
            }
        }
        if (level==0) {
            //сортируем получившийся список
            list.sort(function(a,b){
                if (a.length>b.length) return 1;
                if (a > b) return 1;
                if (b < a) return -1;
                return 0;
            });
        }
    }
    
    try {
        //загружаем список всех index.js файлов из g.config.scripts_path
        yield update_list_route_files(g.config.scripts_path);
        //console.log(list);
    } catch(e) {
        console.log(g.util.inspect(e))
    }
    
    try {
        //загружаем список всех index.js файлов из g.config.scripts_path
        yield update_list_route_files(g.config.scripts_path);
        //console.log(list);
    } catch(e) {
        console.log(g.util.inspect(e))
    }
    
})();

/************
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
  var users = [{name: 'Dead Horse'}, {name: 'Jack'}, {name: 'Tom'}];
  yield this.render('content', {users: users});
  yield next;
})

app.use(public.middleware())
//-----------------------------------------------------------
****************/

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
