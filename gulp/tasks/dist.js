var gulp = require('gulp');

module.exports = function () {
    return gulp
        .src(['./build/js/zuix.*'])
        .pipe(gulp.dest('./docs/js/'))
};