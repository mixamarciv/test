var g = require('../../../../inc.js');
var f = g.functions;
var clog = console.log;
var tf = g.thunkify;


module.exports = tf(render);

function render(file,fn){
    clog('render: '+file);
    
    var p = g.path;
    
    var gulp = require('gulp');
    var less = require('gulp-less');
    var concat = require('gulp-concat');
    var minifycss = require('gulp-minify-css');
    
    gulp.task('less_render', function(){
        return gulp.src(g.path.join(__dirname,'styles.less'))
            .pipe(less())
            .pipe(concat(p.basename(file)))
            .pipe(minifycss())
            .pipe(gulp.dest(p.dirname(file)));
    });
    
    gulp.start('less_render',function(err){
      //gutil.log('done building chrome app.');
      //done();
      fn(err);
    });
    
    
}
