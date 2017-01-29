var gulp = require('gulp');
var dox = require("gulp-dox");

module.exports = function () {
    gulp.src('./src/js/zuix/Zuix.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api'));
    gulp.src('./src/js/helpers/ZxQuery.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api'));
    return true;
};