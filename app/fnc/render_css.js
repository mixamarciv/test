var g = require('../../inc.js');
var f = g.functions;
var c = g.config;
var clog = console.log;


module.exports = render_css;

function render_css(options,fn){
    var file = options.render_file;
    var files = options.files;
    //clog('render: '+file);
    
    var path = g.path;
    
    var gulp = require('gulp');
    var plumber = require('gulp-plumber');
    var concat = require('gulp-concat');
    var less = require('gulp-less');
    var minifycss = require('gulp-minify-css');
    var is_call_fn = 0;
    
    gulp.task('render_css', function(){
        //clog('files: '+files);
        var p = gulp.src(files)
                    .pipe(plumber({errorHandler: onError}))
                    .pipe(concat(path.basename(file)));
        if(options.use_less) p.pipe(less());
        if(options.use_minify) p.pipe(minifycss());
        p.pipe(gulp.dest(path.dirname(file)));
    });
    
    function onError(err){
        //clog('render_css error: '+err.message);
        if (is_call_fn) return;
        else is_call_fn = 1;
        
        fn(err);
    }

    gulp.start('render_css',function(err){
        if (is_call_fn) return;
        else is_call_fn = 1;
        
        if (err) return fn(err);
        g.functions.wait_for_file(file,{timeout:100,cnt:10},fn);
    });
    
}
