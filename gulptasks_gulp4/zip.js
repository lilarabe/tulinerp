/*载入gulp*/
const gulp = require('gulp');
/** 子进程 */
const exec = require('child_process').exec;
/** zip */
const zip = require('gulp-zip');

/** zip */
gulp.task('zip', () => {
    return gulp.src('./dist/cn_tulin_erp/prod/**/*')
        .pipe(zip('prod.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('zip-browser', () => {
    return gulp.src('./dist/cn_tulin_erp/prod/browser/**/*')
        .pipe(zip('browser.zip'))
        .pipe(gulp.dest('dist'));
});