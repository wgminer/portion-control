var gulp = require('gulp');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');

var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var secrets = require('./secrets.json');

require('require-dir')('./gulp');

gulp.task('serve', function (cb) {
    runSequence(['build-site', 'build-extension'], 'serve-site', ['watch-site', 'watch-extension'], cb);
});

gulp.task('deploy', ['build-site', 'build-extension'], function (cb) {

    var conn = ftp.create({
        host: secrets.production.host,
        user: secrets.production.user,
        password: secrets.production.password,
        parallel: 3,
        maxConnections: 5,
        log: gutil.log
    }); 

    var globs = [
        './build/site/**',
    ];

    gulp.src('./build/extension/*')
        .pipe(zip('extension.zip'))
        .pipe(gulp.dest('./build'));

    return gulp.src(globs, {base: './build/site', buffer: false})
        .pipe(conn.newer(secrets.production.path))
        .pipe(conn.dest(secrets.production.path));
});