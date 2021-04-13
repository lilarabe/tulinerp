/*载入gulp*/
const gulp = require('gulp');
/*文件的同步处理*/
const runSequence = require('run-sequence');
/*文档替换*/
const replace = require('gulp-replace');
/*取文件/路径/名/内容*/
const through2 = require('through2');




const date = new Date();
/* v : 版本号 以日期的形式生成字符串，例如: 2016-12-1--23:1:19*/
const v = date.getFullYear() + '_' +
    (+date.getMonth() + 1) + '_' +
    date.getDate() + '__' +
    date.getHours() + '_' +
    date.getMinutes() + '_' +
    date.getSeconds();



/* 设置 css js 文件后缀 */
// <link href="build/main.4134bd69.css" rel="stylesheet"> 
gulp.task('set-no-cache', () => {
    const indexHtml = "./platforms/browser/www/index.html";
    // const indexHtml = "./dist/cn_tulin_erp/prod/browser/index.html";
    const replaceHandle = ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`index.html 内容替换: ${$1}`);
        console.log(`替换为: ${$2}?v=${v}`);
        return $1.replace(reg, `${$2}?v=${v}`);
    }
    return gulp.src(indexHtml, {
        base: '.'
    })
        /* css 后缀更改 */
        .pipe(
            replace(/<link\s+href=\"build\/(main\.[0-9a-z]+\.css)\"\s+rel=\"stylesheet\">/i, ($1, $2) => {
                return replaceHandle($1, $2);
            })
        )
        /* js 后缀更改 */
        .pipe(
            replace(/<script\s+src="build\/(vendor\.[0-9a-z]+\.js)"><\/script>/i, ($1, $2) => {
                return replaceHandle($1, $2);
            })
        )
        .pipe(
            replace(/<script\s+src="build\/(main\.[0-9a-z]+\.js)"><\/script>/i, ($1, $2) => {
                return replaceHandle($1, $2);
            })
        )
        .pipe(gulp.dest('.'));
});