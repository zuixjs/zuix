var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var compiler = require('gulp-closure-compiler');
//var compiler = require('google-closure-compiler-js').gulp();
module.exports = function() {
    return gulp.src('./build/js/zuix.js', {base: './'})
        .pipe(sourcemaps.init())
        .pipe(compiler({
            fileName: './build/js/zuix.min.js',  // outputs single file
            compilerFlags: {
                warning_level: 'DEFAULT',
    //            useTypesForOptimization: true,
                compilation_level: 'SIMPLE',
                create_source_map: true
            }
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
        .pipe(gulp.dest('./docs/js'))
};