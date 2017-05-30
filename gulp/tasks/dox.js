var gulp = require('gulp');
var dox = require("gulp-dox");

module.exports = function () {
    // Zuix main classes
    gulp.src('./src/js/zuix/Zuix.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    gulp.src('./src/js/zuix/ContextOptions.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    gulp.src('./src/js/zuix/ComponentContext.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    gulp.src('./src/js/zuix/ContextController.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    gulp.src('./src/js/helpers/ZxQuery.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    // Localizer
    gulp.src('./src/js/localizer/Localizer.js')
        .pipe(dox({ raw: true }))
        .pipe(gulp.dest('./docs/content/api/data'));
    return true;
};