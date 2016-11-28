var gulp = require('gulp');
var gutil = require('gulp-util');

var del = require('del');
var runSequence = require('run-sequence');

var postcss = require('gulp-postcss');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
// var ngAnnotate = require('gulp-ng-annotate');
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

gulp.task('extension.clean', function () {
    return del(['./build/extension/**/*', './build/extension.zip']);
});

gulp.task('extension.img', function() {
    return gulp.src(['./src/extension/img/**/*'])
        .pipe(gulp.dest('./build/extension/img'));
});

gulp.task('extension.json', function() {
    return gulp.src(['./src/extension/**/*.json'])
        .pipe(gulp.dest('./build/extension'));
});

gulp.task('extension.scss', function () {

    var plugins = [
        require('autoprefixer'),
        require('cssnano')
    ];

    return gulp.src('./src/extension/scss/**/*.scss')
        .pipe(sass())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/extension/css'));
});

gulp.task('extension.jade', function() {
    return gulp.src('./src/extension/**/*.jade')
        .pipe(jade())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(gulp.dest('./build/extension'));
});

gulp.task('extension.js', function () {

    var scripts = [ 
        './libs/jquery/dist/jquery.js',
        './libs/lodash/lodash.js',
        './libs/firebase/firebase.js',
        './libs/angular/angular.js',
        './libs/angularfire/dist/angularfire.js',
        './libs/moment/moment.js',
        './libs/angular-moment/angular-moment.js',
        './libs/angular-ui-router/release/angular-ui-router.js',
        './src/extension/js/**/*.js'
    ];

    return gulp.src(scripts)
        .pipe(gulp.dest('./build/extension/js'));
});

gulp.task('build-extension', function (cb) {
    runSequence('extension.clean', ['extension.img', 'extension.json', 'extension.jade', 'extension.scss', 'extension.js'], cb);
});

gulp.task('watch-extension', function () {
    gulp.watch('scss/**/*.scss', {cwd: './src/extension'}, ['extension.scss']);
    gulp.watch('**/*.jade', {cwd: './src/extension'}, ['extension.jade']);
    gulp.watch('img/**/*', {cwd: './src/extension'}, ['extension.img']);
    gulp.watch(['js/**/*.js', '**/*.json'], {cwd: './src/extension'}, ['extension.json', 'extension.js']);
});

gulp.task('zip-extension', ['build-extension'], function () {
    return gulp.src('build/extension/**/*')
        .pipe(zip('soundspy.zip'))
        .pipe(gulp.dest('./dist'));
});