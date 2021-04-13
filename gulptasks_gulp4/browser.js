/*载入gulp*/
const gulp = require('gulp');
/*文件的同步处理*/
const runSequence = require('run-sequence');
/*文档替换*/
const replace = require('gulp-replace');
/*取文件/路径/名/内容*/
const through2 = require('through2');
/* 删除 */
const del = require('del');

const chcpData = require('../config/chcp.config');



const date = new Date();
/* v : 版本号 以日期的形式生成字符串，例如: 2016-12-1--23:1:19*/
const v = date.getFullYear() + '-' +
  (+date.getMonth() + 1) + '-' +
  date.getDate() + '--' +
  date.getHours() + ':' +
  date.getMinutes() + ':' +
  date.getSeconds();


/* 更新 browser dist 上的文件 debug */
gulp.task('del-server-code-browser-debug', async () => {
  const cleanPath = chcpData.browser_local_path_debug;
  return await del(
    [
      chcpData.browser_local_path_debug + '**/*',
      `!${chcpData.browser_local_path_debug}/android`,
      `!${chcpData.browser_local_path_debug}/ios`
    ], {
      force: true
    }).then((paths) => {
    console.log('删除dist/debug文件:\n', paths.join('\n'));
  });
});

/* 更新 browser dist 上的文件 prod */
gulp.task('del-server-code-browser-prod', async () => {
  const cleanPath = chcpData.browser_local_path_prod;
  return await del(
    [
      chcpData.browser_local_path_prod + '**/*',
      `!${chcpData.browser_local_path_prod}/android`,
      `!${chcpData.browser_local_path_prod}/ios`
    ], {
      force: true
    }).then((paths) => {
    console.log('删除dist/prod文件:\n', paths.join('\n'));
  });
});

/* 屏蔽 cordova.js */
gulp.task('stop-cordova', () => {
  const indexHtml = "./platforms/browser/www/index.html";
  return gulp.src(indexHtml, {
      base: '.'
    })
    .pipe(replace(/<script src="cordova.js"><\/script>?/i, ($1) => {
      return `<!-- ${$1} -->`;
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('copy-code-browser-debug', gulp.series('stop-cordova', 'del-server-code-browser-debug', () => {
  const cleanPath = chcpData.browser_local_path_debug;
  console.log(`拷贝browser文件 ./platforms/browser/www`);
  console.log(`拷贝到目录 ${cleanPath}`);
  return gulp.src('./platforms/browser/www/**/*')
    .pipe(gulp.dest(cleanPath));
}));

gulp.task('copy-code-browser-prod', gulp.series('stop-cordova', 'del-server-code-browser-prod', () => {
  const cleanPath = chcpData.browser_local_path_prod;
  console.log(`拷贝browser文件 ./platforms/browser/www`);
  console.log(`拷贝到目录 ${cleanPath}`);
  return gulp.src('./platforms/browser/www/**/*')
    .pipe(gulp.dest(cleanPath));
}));



