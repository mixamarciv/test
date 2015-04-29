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
    options.files = [path.join2(c.client_lib_path,'/bootstrap/**/**min.css'),
                    ];
    options.files = [path.join2(c.client_lib_path,'/lib/bootstrap/**/**min.css'),
                    ];
    options.use_less = 0;
    options.use_minify = 0;
    f.render_css(options,fn);
    
}
