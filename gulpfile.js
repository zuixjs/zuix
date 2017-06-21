var gulp = require('./gulp')([
    'zuix/browserify',
    'zuix/compile',
    'zuix/dox',
    'bundler/browserify',
    'bundler/compile'
]);
gulp.task('default', function() {
    // zuix
    gulp.start('zuix/browserify');
    gulp.start('zuix/dox');
    // zuix-bundler
    gulp.start('bundler/browserify');
    // Wait browserify to complete before running google-closure-compiler
    gulp.on('task_stop', function (event) {
        switch(event.task) {
            case 'zuix/browserify':
                gulp.start('zuix/compile');
                break;
            case 'bundler/browserify':
                gulp.start('bundler/compile');
                break;
        }
    });
});
