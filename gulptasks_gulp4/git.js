/*载入gulp*/
const gulp = require('gulp');
/** 子进程 */
const exec = require('child_process').exec;

// status  执行git add 操作
gulp.task('git-status', function (cb) {
    exec('git status', function (err, stdout, stderr) {
        cb(err);
    });
});

// add  执行git add 操作
gulp.task('git-add', function (cb) {
    exec('git add .', function (err, stdout, stderr) {
        cb(err);
    });
});

// push  执行git push 操作
gulp.task('git-push', function (cb) {
    exec('git push origin cn.tulin.erp', function (err, stdout, stderr) {
        cb(err);
    });
});

// pull  执行git pull 操作
gulp.task('git-pull', function (cb) {
    exec('git pull origin cn.tulin.erp', function (err, stdout, stderr) {
        cb(err);
    });
});

// commit   附加自定义commit的push操作
gulp.task('git-commit', function (cb) {
    const message = 'git脚本提交'
    exec(`git commit -m"${message}"`, function (err, stdout, stderr) {
        cb(err);
    });
});

gulp.task('git', gulp.series('git-pull', 'git-add', 'git-commit', 'git-push', 'git-status'), (done) => {
    console.log('git 提交完毕');
    done();
});