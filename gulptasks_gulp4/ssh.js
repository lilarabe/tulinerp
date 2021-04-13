/*载入gulp*/
const gulp = require('gulp');
/** 子进程 */
const exec = require('child_process').exec;

const fs = require('fs');

const GulpSSH = require('gulp-ssh');

const gulpConfig = require('../gulp_config');

// const sshConfig = {
//     host: '118.25.74.169',
//     port: 10167,
//     username: 'ubuntu',
//     password: 'Dandian=6',
//     // privateKey: fs.readFileSync(gulpConfig.privateKey)
// }

const sshConfig = {
    host: '192.168.200.114',
    port: 22,
    username: 'ubuntu',
    password: 'Dandian=6',
    // privateKey: fs.readFileSync(gulpConfig.privateKey)
}

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: sshConfig
})

/** ssh 部署*/
gulp.task('ssh-deploy', () => {
    console.log('部署cn_tulin_erp热更新文件...');
    const commands = [
        `sudo chmod -R 777 /var/www/qbweb_linux/uploadfiles/hotcode/cn_tulin_erp/`,
        `cd /var/www/qbweb_linux/uploadfiles/hotcode/cn_tulin_erp/`,
        `rm -rf android/`,
        `rm -rf ios/`,
        `rm -rf browser/`,
        `unzip prod.zip`,
        `rm -f prod.zip`,
        `sudo chmod -R 777 /var/www/qbweb_linux/uploadfiles/hotcode/cn_tulin_erp/`,
    ];
    return gulpSSH.shell(commands, { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});


/** 上传 zip */
gulp.task('ssh-upload-zip', () => {
    console.log('上传cn_tulin_erp热更新压缩文件...');
    return gulp
        .src(['./dist/prod.zip'])
        .pipe(gulpSSH.dest(`/var/www/qbweb_linux/uploadfiles/hotcode/cn_tulin_erp/`));
});

/** ssh browser 部署*/
gulp.task('ssh-browser-deploy', () => {
    console.log('部署browser...');
    const commands = [
        `sudo chmod -R 777 /var/www/DEMO_QBWEB/mapp/`,
        `cd /var/www/DEMO_QBWEB/mapp/`,
        `rm -rf !(browser.zip)`,
        `unzip browser.zip`,
        `rm -f browser.zip`,
        `sudo chmod -R 777 /var/www/DEMO_QBWEB/mapp/`,
    ];
    return gulpSSH.shell(commands, { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});

gulp.task('ssh-browser-deploy-prod', () => {
    console.log('部署browser...');
    const commands = [
        `sudo chmod -R 777 /var/www/tsp/Mapp_Temp/`,
        `cd /var/www/tsp/Mapp_Temp`,
        `rm -rf !(browser.zip)`,
        `unzip browser.zip`,
        `rm -f browser.zip`,
        `sudo chmod -R 777 /var/www/tsp/Mapp_Temp`,
    ];
    return gulpSSH.shell(commands, { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});

/** 上传 browser zip */
gulp.task('ssh-upload-browser-zip', () => {
    console.log('上传browser.zip...');
    return gulp
        .src(['./dist/browser.zip'])
        .pipe(gulpSSH.dest(`/var/www/DEMO_QBWEB/mapp`));
});

gulp.task('ssh-upload-browser-zip-prod', () => {
    console.log('上传browser.zip...');
    return gulp
        .src(['./dist/browser.zip'])
        .pipe(gulpSSH.dest(`/var/www/tsp/Mapp_Temp`));
});

/** ssh */
gulp.task('ssh', gulp.series('ssh-upload-zip', 'ssh-deploy', (done) => {
    console.log('部署cn_tulin_erp热更新文件完毕!');
    done();
}));

/** ssh-browser */
gulp.task('ssh-browser', gulp.series('ssh-upload-browser-zip', 'ssh-browser-deploy', (done) => {
    console.log('部署browser文件完毕!');
    done();
}));

gulp.task('ssh-browser-prod', gulp.series('ssh-upload-browser-zip-prod', 'ssh-browser-deploy-prod', (done) => {
    console.log('部署browser文件完毕!');
    done();
}));