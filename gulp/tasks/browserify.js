var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
module.exports = function() {
    return gulp.src('src/js/zuix.js', { read: false }).
        pipe(browserify({
            standalone: 'zuix'
        }))
        .pipe(rename('zuix.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(gulp.dest('./docs/js'))
};
