// Include gulp
var gulp = require('gulp'); 

// pull in the plugins
$ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "./"
    });
});

// task for reloading the browser
gulp.task('bs-reload', function() {
    browserSync.reload();
});

// Lint Javascript Task
gulp.task('lint', function() {
    return gulp.src('assets/js/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

// compile, prefix, and minify the sass
gulp.task('styles', function() {
    return gulp.src('assets/scss/*.scss')
        .pipe($.rubySass({ "sourcemap=none": true }))
        .pipe($.autoprefixer(["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1" , "ie 7"], { cascade: true }))
        .pipe(gulp.dest('.'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({stream:true}));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('assets/js/*.js')
        .pipe($.sourcemaps.init())
            .pipe($.concat('all.min.js'))
            .pipe($.uglify())
        .pipe($.sourcemaps.write('../maps'))
        .pipe(gulp.dest('assets/js/dist'))
        .pipe(browserSync.reload({stream:true}));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/js/*.js', ['lint', 'scripts']);
    gulp.watch('assets/scss/**/*.scss', ['styles']);
    gulp.watch('**/*.html', ['bs-reload']);
    gulp.watch('**/*.php', ['bs-reload']);
});

// Default Task
gulp.task('default', ['lint', 'styles', 'scripts', 'browser-sync', 'watch']);