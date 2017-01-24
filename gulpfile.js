var gulp = require('./gulp')([
    'browserify',
    'compile',
    'dist'
]);

//gulp.task('build', ['browserify', 'compile', 'dist']);
//gulp.task('default', ['build', 'watch', 'serve', 'open']);