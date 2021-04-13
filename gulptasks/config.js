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



/**
 * 清空 dist debug 目录
 */
gulp.task('clean-android-dir-debug', (cb) => {
  const path = chcpData.android_local_path_debug + '/**/*';
  console.log(`清空 dist debug android 目录`);
  console.log(path);
  return del([path], cb);
});

/**
 * 清空 dist prod 目录
 */
gulp.task('clean-android-dir-prod', (cb) => {
  const path = chcpData.android_local_path_prod + '/**/*';
  console.log(`清空 dist prod android 目录`);
  console.log(path);
  return del([path], cb);
});

/**
 * 清空 serve debug 目录
 */
gulp.task('clean-serve-dir-debug', (cb) => {
  const path = chcpData.serve_path_debug + '/**/*';
  console.log(`清空 serve debug 目录`);
  console.log(path);
  return del([path], {
    force: true
  }, cb);
});

/**
 * 清空 serve prod 目录
 */
gulp.task('clean-serve-dir-prod', (cb) => {
  const path = chcpData.serve_path_prod + '/**/*';
  console.log(`清空 serve prod 目录`);
  console.log(path);
  return del([path], {
    force: true
  }, cb);
});

/**
 * 拷贝app-debug.apk 到本地
 */
gulp.task("copy-debug-apk", () => {
  const path = chcpData.android_local_path_debug;
  console.log(`拷贝app-debug.apk 到本地:${path}`);
  return gulp.src('./platforms/android/app/build/outputs/apk/debug/app-debug.apk')
    .pipe(gulp.dest(path));
})

/**
 * copy serve debug 目录
 */
gulp.task('copy-serve-dir-debug', (cb) => {
  const path = chcpData.serve_path_debug;
  console.log(`拷贝文件到服务器 debug`);
  return gulp.src(chcpData.local_path_debug+'/**/*')
    .pipe(gulp.dest(path));
});

/**
 * copy serve debug 目录
 */
gulp.task('copy-serve-debug', () => {
  runSequence(['clean-serve-dir-debug'], ['copy-serve-dir-debug']);
});

/**
 * copy serve prod 目录
 */
gulp.task('copy-serve-dir-prod', (cb) => {
  const path = chcpData.serve_path_prod;
  const src = chcpData.local_path_prod;
  console.log(`拷贝文件到服务器 prod`);
  return gulp.src(`${src}/**/*`)
    .pipe(gulp.dest(path));
});

/**
 * copy serve prod 目录
 */
gulp.task('copy-serve-prod', () => {
  runSequence(['clean-serve-dir-prod'], ['copy-serve-dir-prod']);
});

/** 
 * 修改environment.prod.ts prod
 */
gulp.task('environments-dataUrl-prod', () => {
  return gulp.src('./src/environments/environment.prod.ts', {
      base: '.'
    })
    .pipe(
      replace(/dataUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改environment.prod.ts`);
        console.log($1);
        console.log($2);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.environments_dataUrl_prod}`);
      })
    )
    .pipe(gulp.dest(''));
});

/** 
 * 修改environment.prod.ts debug
 */
gulp.task('environments-dataUrl-debug', () => {
  return gulp.src('./src/environments/environment.ts', {
      base: '.'
    })
    .pipe(
      replace(/dataUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改environment.ts`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.environments_dataUrl_debug}`);
      })
    )
    .pipe(gulp.dest(''));
});

/** 修改 config.js 属性 */
gulp.task('edit-config-prod', () => {
  return gulp.src('./src/config.js', {
      base: '.'
    })
    .pipe(
      replace(/baseUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 config.js baseUrl属性:${chcpData.environments_dataUrl_prod}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.environments_dataUrl_prod}`);
      })
    )
    .pipe(
      replace(/androidHotCodePath\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 config.js androidHotCodePath 属性:${chcpData.android_chcp_content_url_prod}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.android_chcp_content_url_prod}`);
      })
    )
    .pipe(
      replace(/iosHotCodePath\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 config.js iosHotCodePath 属性:${chcpData.ios_chcp_content_url_prod}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.ios_chcp_content_url_prod}`);
      })
    )
    .pipe(
      replace(/fileBaseUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,?/i, ($1, $2) => {
        console.log(`修改 config.js fileBaseUrl 属性:${chcpData.fileBaseUrl_prod}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.fileBaseUrl_prod}`);
      })
    )
    .pipe(gulp.dest(''));
});

gulp.task('edit-config-debug', () => {
  return gulp.src('./src/config.js', {
      base: '.'
    })
    .pipe(
      replace(/baseUrl\s*:\s*[\"|\'](\S+)?[\"|\']\s*\,/i, ($1, $2) => {
        console.log(`修改 config.js baseUrl属性:${chcpData.environments_dataUrl_debug}`);
        const reg = new RegExp($2);
        return $1.replace(reg, `${chcpData.environments_dataUrl_debug}`);
      })
    )
    .pipe(gulp.dest(''));
});


/** 
 * 设置 config.xml
 */
gulp.task('set-config-xml', () => {
  return gulp.src('./config.xml')
    /** 修改微信appId */
    .pipe(
      replace(/<variable\s+name="WECHATAPPID"\s+value="(\w+)"\s+\/>/i, ($0, $1) => {
        const reg = new RegExp($1);
        console.log(`修改config.xml - 微信appId: ${chcpData.wechatAppid}`);
        return $0.replace(reg, chcpData.wechatAppid);
      })
    )
    /** 极光推送Id */
    .pipe(
      replace(/<plugin\s+name="jpush-phonegap-plugin"[\d|\D]+?>[\d|\D]+<variable\s+name="APP_KEY"\s+value="(\w+)"\s+\/>/i, ($0, $1) => {
        const reg = new RegExp($1);
        console.log(`修改config.xml - 极光推送Id: ${chcpData.jpushId}`);
        return $0.replace(reg, chcpData.jpushId);
      })
    )
    .pipe(gulp.dest('.'));
});


/** 
 * 设置 package.json
 */

gulp.task('set-package-json', () => {
  return gulp.src('./package.json')
    /** 修改微信appId */
    .pipe(
      replace(/"WECHATAPPID"\s?:\s?"(\w+)"/i, ($0, $1) => {
        const reg = new RegExp($1);
        console.log(`修改package.json - 微信appId: ${chcpData.wechatAppid}`);
        return $0.replace(reg, chcpData.wechatAppid);
      })
    )
    /** 极光推送Id */
    .pipe(
      replace(/"jpush-phonegap-plugin"\s?:\s?\{[\d|\D]+?"APP_KEY"\s?:\s?"(\w{10,})",/i, ($0, $1) => {
        const reg = new RegExp($1);
        console.log(`修改package.json - 极光推送Id: ${chcpData.jpushId}`);
        return $0.replace(reg, chcpData.jpushId);
      })
    )
    .pipe(gulp.dest('.'));
});


/** 
 * 设置配置文件完毕
 */
gulp.task('set-config', ['set-config-xml', 'set-package-json'], () => {
  console.log('设置配置文件完毕');
});
