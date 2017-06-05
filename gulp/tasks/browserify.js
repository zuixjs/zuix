var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var header = require('gulp-header');
module.exports = function() {
    // zuix.js
    gulp.src('src/js/main.js', { read: false }).
        pipe(browserify({
            standalone: 'zuix'
        }))
        // this is necessary for types recognition
        .pipe(header('/** @typedef {Zuix} window.zuix */'))
        .pipe(rename('zuix.js'))
        .pipe(gulp.dest('./dist/js'));
    // zuix-bundler.js
    gulp.src('src/js/bundler.js', { read: false }).
        pipe(browserify({
            standalone: 'zuix-bundler'
        }))
        .pipe(rename('zuix-bundler.js'))
        .pipe(gulp.dest('./dist/js'));
};