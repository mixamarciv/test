var g = require('../../base_inc.js');
var f = g.functions;
var c = g.config;
var clog = console.log;


module.exports = render_js;

function render_js(options,fn){
    var file = options.render_file;
    var files = options.files;
    //clog('render: '+file);
    
    var path = g.path;
    
    var gulp = require('gulp');
    var plumber = require('gulp-plumber');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    
    var is_call_fn = 0;
    
    gulp.task('render_js', function(){
        //clog('files: '+files);
        var p = gulp.src(files)
                    .pipe(plumber({errorHandler: onError}))
                    .pipe(concat(path.basename(file)));
        if(options.use_uglify) p.pipe(uglify());
        
        p.pipe(gulp.dest(path.dirname(file)));
    });
    
    function onError(err){
        //clog('render_js error: '+err.message);
        if (is_call_fn) return;
        else is_call_fn = 1;
        
        fn(err);
    }

    gulp.start('render_js',function(err){
        if (is_call_fn) return;
        else is_call_fn = 1;
        
        if (err) return fn(err);
        g.functions.wait_for_file(file,{timeout:100,cnt:300},fn);
    });
}
