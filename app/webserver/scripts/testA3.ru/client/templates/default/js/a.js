var g = require('../../../../inc.js');
var f = g.functions;
var c = g.config;
var clog = console.log;
var tf = g.thunkify;
var path = g.path;


module.exports = tf(render);

function render(file,fn){
    clog('render js: '+file);
    
    var options = {render_file:file};
    options.files = [g.path.join2(c.client_lib_path,'/lib/jquery/dist/**/**min.js'),
                     g.path.join2(c.client_lib_path,'/lib/bootstrap/**/**min.js'),
                     g.path.join2(c.client_lib_path,'/lib/underscore/**/**min.js')
                    ];
    options.use_uglify = 0;
    //clog(options);
    f.render_js(options,fn);
}
