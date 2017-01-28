var gulp = require('gulp');
var dox = require("gulp-dox");

module.exports = function () {
    return gulp.src('./src/js/helpers/ZxQuery.js')
        .pipe(dox())
        .pipe(gulp.dest('./docs/content/api'));
};