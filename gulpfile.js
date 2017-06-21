var gulp = require('./gulp')([
    'browserify',
    'compile',
    'dox'
]);
gulp.task('default', ['browserify', 'compile']);