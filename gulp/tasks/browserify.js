var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
module.exports = function() {
    // zuix.js
    gulp.src('src/js/main.js', { read: false }).
        pipe(browserify({
            standalone: 'zuix'
        }))
        .pipe(rename('zuix.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(gulp.dest('./docs/js'));
    // zuix-bundler.js
    gulp.src('src/js/bundler.js', { read: false }).
        pipe(browserify({
            standalone: 'zuix-bundler'
        }))
        .pipe(rename('zuix-bundler.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(gulp.dest('./docs/js'));
};