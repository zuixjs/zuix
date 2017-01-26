var gulp = require('gulp');
var compiler = require('gulp-closure-compiler');
module.exports = function() {
    gulp.src('build/js/zuix.js', {base: 'build/js/'})
        .pipe(compiler({
            fileName: 'build/js/zuix.min.js',  // outputs single file
            compilerFlags: {
                //debug: true, // <-- DO NOT ACTIVATE, causes errors in generated js
                warning_level: 'DEFAULT',
//              useTypesForOptimization: true,
                compilation_level: 'SIMPLE',
                language_in: 'ECMASCRIPT5_STRICT',
                define: [
                    "goog.DEBUG=false"
                ],
                create_source_map: 'build/js/zuix.min.js.map',
                source_map_location_mapping: 'build/js/|./',
                output_wrapper: "%output%\n//# sourceMappingURL=zuix.min.js.map"
            }
        }))
        .pipe(gulp.dest('build/js'));
};