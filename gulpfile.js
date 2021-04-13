/*载入gulp*/
const gulp = require('gulp');
/* 导入其他任务 */
const requireDir = require('require-dir');
const tasks = requireDir('./gulptasks_gulp4');


/*默认处理*/
gulp.task('default', () => {});