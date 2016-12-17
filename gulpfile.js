var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var del = require('del');
var postcss = require('gulp-postcss');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var io = require('socket.io');
var upload = require('./upload.js');

gulp.task('clean', function () {
    return del(['./build', './portion-control.zip']);
});

gulp.task('assets', function() {
    return gulp.src(['./src/assets/**/*'])
        .pipe(gulp.dest('./build/assets'));
});

gulp.task('json', function() {
    return gulp.src(['./src/**/*.json'])
        .pipe(gulp.dest('./build'));
});

gulp.task('scss', function () {

    var plugins = [
        require('autoprefixer')
    ];

    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('pug', function() {
    return gulp.src('./src/**/*.pug')
        .pipe(pug())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(gulp.dest('./build'));
});

gulp.task('js', function () {

    var scripts = [ 
        './libs/jquery/dist/jquery.js',
        './libs/lodash/lodash.js',
        './libs/firebase/firebase.js',
        './libs/angular/angular.js',
        './libs/angularfire/dist/angularfire.js',
        './libs/moment/moment.js',
        './libs/angular-moment/angular-moment.js',
        './libs/angular-ui-router/release/angular-ui-router.js',
        './src/js/**/*.js'
    ];

    return gulp.src(scripts)
        .pipe(gulp.dest('./build/js'));
});

gulp.task('build', function (cb) {
    runSequence('clean', ['assets', 'json', 'pug', 'scss', 'js'], cb);
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', {cwd: './src'}, ['scss']);
    gulp.watch('**/*.pug', {cwd: './src'}, ['pug']);
    gulp.watch('assets/**/*', {cwd: './src'}, ['assets']);
    gulp.watch(['js/**/*.js', '**/*.json'], {cwd: './src'}, ['json', 'js']);
});

gulp.task('zip', ['build'], function () {
    return gulp.src('build/**/*')
        .pipe(zip('portion-control.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function () {

    var options = require('./secrets.json');

    return gulp.src('./portion-control.zip')
        .pipe(upload(options))
        .pipe(gulp.dest('./'));

});


gulp.task('serve', function (cb) {
    runSequence('zip', 'watch', cb);
});