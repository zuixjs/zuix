var gulp = require('gulp');
var dox = require("gulp-dox");

module.exports = function () {
    return Promise.all([
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/zuix/Zuix.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/zuix/ContextOptions.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/zuix/ComponentContext.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/zuix/ContextController.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/helpers/ZxQuery.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./src/js/localizer/Localizer.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest('./_docs/content/api/data'))
                .on('end', resolve);
        })
    ]).then(function () {
        // Other actions
    });
};