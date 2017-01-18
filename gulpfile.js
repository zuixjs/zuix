var gulp = require('./gulp')([
    'browserify',
    'closure'
]);

gulp.task('build', ['browserify', 'closure']);
//gulp.task('default', ['build', 'watch', 'serve', 'open']);