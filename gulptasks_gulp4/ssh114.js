/*载入gulp*/
const gulp = require('gulp');
/** 子进程 */
const exec = require('child_process').exec;

const fs = require('fs');

const GulpSSH = require('gulp-ssh');

const gulpConfig = require('../gulp_config');

const sshConfig = {
    host: '192.168.200.114',
    port: 22,
    username: 'ubuntu',
    password: 'Dandian=6',
    // privateKey: fs.readFileSync(gulpConfig.privateKey)
}

// const sshConfig = {
//     host: '192.168.200.119',
//     port: 22,
//     username: 'ubuntu',
//     password: 'Dandian=6',
//     // privateKey: fs.readFileSync(gulpConfig.privateKey)
// }

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: sshConfig
})


/** ssh browser 部署*/
gulp.task('ssh-browser-deploy-debug', () => {
    console.log('部署browser...');
    const commands = [
        `sudo chmod -R 777 /var/www/qbweb_linux/mapp/`,
        `cd /var/www/qbweb_linux/mapp/`,
        `rm -rf !(browser.zip)`,
        `unzip browser.zip`,
        `rm -f browser.zip`,
        `sudo chmod -R 777 /var/www/qbweb_linux/mapp/`,
    ];
    return gulpSSH.shell(commands, { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});



/** 上传 browser zip */
gulp.task('ssh-upload-browser-zip-debug', () => {
    console.log('上传browser.zip...');
    return gulp
        .src(['./dist/browser.zip'])
        .pipe(gulpSSH.dest(`/var/www/qbweb_linux/mapp/`));
});



gulp.task('ssh-browser-debug', gulp.series('ssh-upload-browser-zip-debug', 'ssh-browser-deploy-debug', (done) => {
    console.log('部署browser文件完毕!');
    done();
}));