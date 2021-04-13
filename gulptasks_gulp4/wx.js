/*载入gulp*/
const gulp = require('gulp');

/*文档替换*/
const replace = require('gulp-replace');
/*取文件/路径/名/内容*/
const through2 = require('through2');
/* 删除 */
const del = require('del');
/** 子进程 */
const exec = require('child_process').exec;
/** zip */
const zip = require('gulp-zip');

const configData = require('../config/configs.config');



gulp.task('clear-zip-files', async () => {
  return await del(
    [
      './zip**/*',
      './dist/wx/**/*',
    ], {
    force: true
  }).then((paths) => {
    console.log('清空zip dist/wx文件夹:\n', paths.join('\n'));
  });
});

gulp.task('zip-wx', () => {
  return gulp.src('./platforms/browser/www/**/*')
    .pipe(zip('browser.zip'))
    .pipe(gulp.dest('./zip'));
});

gulp.task('copy-wx', () => {
  return gulp.src('./platforms/browser/www/**/*')
    .pipe(gulp.dest('./dist/wx'));
});

const getProjectInfo = () => {
  var projectInfo = {};
  var publishProjectName = process.argv[3];
  if (publishProjectName !== undefined) {
    publishProjectName = publishProjectName.replace(/-publish=/i, '');
    projectInfo = configData[publishProjectName];
  }
  return projectInfo;
}

gulp.task('wx-zip', () => {
  var projectInfo = getProjectInfo();
  return gulp.src('./dist/wx/**/*')
    .pipe(zip(`${projectInfo.wxZipName}.zip`))
    .pipe(gulp.dest('./zip/'))
    .on('end', () => {
      console.log(`${projectInfo.wxZipName}打包完成`);
    });
});

gulp.task('wx-config', ()=>{
  var projectInfo = getProjectInfo();
  return gulp.src('./dist/wx/config.js', {
    base: '.'
  })
    .pipe(
      replace(/baseUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 browser config.js baseUrl属性:${projectInfo.baseUrl}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${projectInfo.baseUrl}`);
      })
    )
    .pipe(
      replace(/corpID\s*:\s*[\"|\'](\w+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 browser config.js corpID属性:${projectInfo.corpID}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${projectInfo.corpID}`);
      })
    )
    .pipe(
      replace(/logoUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 browser config.js logoUrl属性:${projectInfo.logoUrl}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${projectInfo.logoUrl}`);
      })
    )
    .pipe(gulp.dest('.'))
    .on('end', () => {
      console.log(`修改config.js完成`);
    });
});

gulp.task('set-title', () => {
  var projectInfo = getProjectInfo();
  const indexHtml = "./dist/wx/index.html";
  return gulp.src(indexHtml, {
      base: '.'
    })
    .pipe(replace(/<title>\S*<\/title>?/i, ($1) => {
      return `<title>${projectInfo.title}</title>`;
    }))
    .pipe(gulp.dest('.'))
    .on('end', () => {
      console.log(`修改title完成`);
    });
});


gulp.task('wx-init', gulp.series(
  'stop-cordova',
  'clear-zip-files',
  'copy-wx',
  (done) => {
    done();
  }
));

gulp.task('wx-build', gulp.series(
  "set-title",
  'wx-config',
  'wx-zip',
  (done) => {
    done();
  }
));
