var gulp = require('gulp');
var gutil = require('gulp-util');

var del = require('del');
var runSequence = require('run-sequence');

var postcss = require('gulp-postcss');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
// var ngAnnotate = require('gulp-ng-annotate');
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

gulp.task('site.clean', function () {
    return del('./build/site/**/*');
});

gulp.task('site.img', function() {
    return gulp.src(['./src/site/img/**/*'])
        .pipe(gulp.dest('./build/site/img'));
});

gulp.task('site.json', function() {
    return gulp.src(['./src/site/**/*.json'])
        .pipe(gulp.dest('./build/site'));
});

gulp.task('site.scss', function () {

    var plugins = [
        require('autoprefixer'),
        require('cssnano')
    ];

    return gulp.src('./src/site/scss/**/*.scss')
        .pipe(sass())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./build/site/css'));
});

gulp.task('site.jade', function() {
    return gulp.src('./src/site/*.jade')
        .pipe(jade())
        .on('error', function (err) {
            gutil.log(gutil.colors.red(err));
            gutil.beep();
            this.emit('end');
        })
        .pipe(gulp.dest('./build/site'));
});

gulp.task('site.js', function () {

    var scripts = [ 
        './libs/jquery/dist/jquery.js',
        './libs/lodash/lodash.js',
        './libs/firebase/firebase.js',
        './libs/angular/angular.js',
        './libs/angularfire/dist/angularfire.js',
        './libs/moment/moment.js',
        './libs/angular-moment/angular-moment.js',
        './libs/angular-ui-router/release/angular-ui-router.js',
        './src/site/js/**/*.js'
    ];

    return gulp.src(scripts)
        .pipe(gulp.dest('./build/site/js'));
});

gulp.task('site.browser-sync', function() {
    browserSync.init(['./build/css/**/*.css', './build/js/**/*.js', './build/**/*.html'], {
        server: {
            baseDir: './build/site'
        }
    });
});

gulp.task('build-site', function (cb) {
    runSequence('site.clean', ['site.img', 'site.json', 'site.jade', 'site.scss', 'site.js'], cb);
});

gulp.task('serve-site', ['site.browser-sync']);

gulp.task('watch-site', function () {
    gulp.watch('scss/**/*.scss', {cwd: './src/site'}, ['site.scss']);
    gulp.watch('**/*.jade', {cwd: './src/site'}, ['site.jade']);
    gulp.watch('img/**/*', {cwd: './src/site'}, ['site.img']);
    gulp.watch(['js/**/*.js', '**/*.json'], {cwd: './src/site'}, ['site.json', 'site.js']);
});

