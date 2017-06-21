var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var header = require('gulp-header');
module.exports = function() {
    // zuix.js
    return gulp.src('src/js/main.js', { read: false })
        .pipe(browserify({
            standalone: 'zuix'
        }))
        // this is necessary for types recognition
        .pipe(header('/** @typedef {Zuix} window.zuix */'))
        .pipe(rename('zuix.js'))
        .pipe(gulp.dest('./dist/js'));
};