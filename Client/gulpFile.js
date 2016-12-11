var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('browserify',function(){
    browserify('src/js/main.js')
        .transform('reactify')
        .bundle()
        .pipe(source('main.js'))//the actual source
        .pipe(gulp.dest('../Server/dist/js'))//destination for the source
});

gulp.task('copy',function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('../Server/dist'));
    gulp.src('src/images/*.*')
        .pipe(gulp.dest('../Server/dist/images'));
    gulp.src('src/css/*.*')
        .pipe(gulp.dest('../Server/dist/css'));
    gulp.src('src/js/vendors/*.*')
        .pipe(gulp.dest('../Server/dist/js/vendors'));
});

gulp.task('default',['browserify','copy'],function(){
    return gulp.watch('src/**/*.*',['browserify','copy']);
});
