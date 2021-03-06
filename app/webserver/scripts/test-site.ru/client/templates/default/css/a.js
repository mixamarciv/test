var g = require('../../../../inc.js');
var f = g.functions;
var c = g.config;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;


module.exports = tf(render);

function render(file,fn){
    clog('render css: '+file);
    
    var options = {render_file:file};
    options.files = [path.join2(__dirname,'slate.bootstrap.min.css'),
                     path.join2(c.client_lib_path,'../css/menuhover/forbootstrap.css'),
                     path.join2(c.client_lib_path,'../css/footer/footer.css')
                    ];
    options.files = [path.join2(c.client_lib_path,'/css/bootstrap/slate/slate.bootstrap.min.css'),
                     path.join2(c.client_lib_path,'/css/stickyfooter.css')
                    ];
    options.use_less = 0;
    options.use_minify = 0;
    f.render_css(options,fn);

}
