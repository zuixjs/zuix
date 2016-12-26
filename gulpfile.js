// jUIce gulp file
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var compiler = require('google-closure-compiler-js').gulp();
gulp.task('build', function() {
    return gulp.src('./src/js/juice.js', {base: './'})
        .pipe(sourcemaps.init())
        .pipe(compiler({
            compilationLevel: 'SIMPLE',
//            warningLevel: 'DEFAULT',
//            outputWrapper: '(function(scope){\n%output%\nreturn scope;}(this));',
//            outputWrapper: '(function(){\n%output%\n}).call(this)',
            jsOutputFile: 'juice.min.js',  // outputs single file
            createSourceMap: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
});
