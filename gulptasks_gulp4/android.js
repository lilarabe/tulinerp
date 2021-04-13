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
/* 导入其他任务 */
const requireDir = require('require-dir');
requireDir('./', {recurse: true});

const chcpData = require('../config/chcp.config');



const date = new Date();
/* v : 版本号 以日期的形式生成字符串，例如: 2016-12-1--23:1:19*/
const v = date.getFullYear() + '-' +
  (+date.getMonth() + 1) + '-' +
  date.getDate() + '--' +
  date.getHours() + ':' +
  date.getMinutes() + ':' +
  date.getSeconds();

/* 热更新版本号 */
let release = '';
/** 
 * 获取www的热更新版本号
 */
gulp.task('get-release-android', () => {
  const reg = /\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}/;
  return gulp.src('./www/chcp.json')
    .pipe(through2.obj((file, encoding, done) => {
      let strJsCode = file.contents.toString();
      strJsCode.replace(reg, ($1) => {
        release = $1 || '';
        return;
      });
      done();
    }));
});

/** 
 * 设置android的热更新版本号
 */
gulp.task('set-release-android', gulp.series('get-release-android', () => {
  const reg = /"release"\s{0,}:\s{0,}"([\d|\D]{0,})"/ig;
  return gulp.src('./platforms/android/app/src/main/assets/www/chcp.json', {
      base: '.'
    })
    .pipe(replace(reg, ($0, $1) => {
      console.log(`当前热更新版本号:${release}`);
      return `"release": "${release}"`
    }))
    .pipe(gulp.dest('.'));
}));

/** 
 * 设置 config.xml debug 信息
 */
gulp.task('set-config-xml-android-debug', () => {
  return gulp.src('./config.xml')
    /** 修改 <name> */
    .pipe(
      replace(/<name>([\D|\d]+)<\/name>/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: name:${chcpData.config_xml.debug.name}`);
        return $1.replace(reg, chcpData.config_xml.debug.name);
      })
    )
    /** 修改 <widget id="" */
    .pipe(
      replace(/<widget[\d|\D]+?id="([\w|\.]+)?"/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: id:${chcpData.config_xml.debug.id}`);
        return $1.replace(reg, chcpData.config_xml.debug.id);
      })
    )
    /** 修改 <config-file url="" /> */
    .pipe(
      replace(/<chcp>[\d\D]+?<config-file\s+url="(\S+)"\s+\/>[\d\D]+?<\/chcp>/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: chcp config-file`);
        return $1.replace(reg, `${chcpData.android_chcp_content_url_debug}/chcp.json`);
      })
    )
    /** 修改 <widget  version="" */
    .pipe(
      replace(/<widget[\d|\D]+?version="([\d|\.]+)?"/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: version:${chcpData.android_debug_version}`);
        return $1.replace(reg, chcpData.android_debug_version);
      })
    )
    .pipe(gulp.dest('.'));
});

/** 
 * 设置 config.xml prod 信息
 */
gulp.task('set-config-xml-android-prod', () => {
  return gulp.src('./config.xml')
    /** 修改 <name> */
    .pipe(
      replace(/<name>([\D|\d]+)<\/name>/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: name:${chcpData.config_xml.prod.name}`);
        return $1.replace(reg, chcpData.config_xml.prod.name);
      })
    )
    /** 修改 <widget id="" */
    .pipe(
      replace(/<widget[\d|\D]+?id="([\w|\.]+)?"/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: id:${chcpData.config_xml.prod.id}`);
        return $1.replace(reg, chcpData.config_xml.prod.id);
      })
    )
    .pipe(
      replace(/<chcp>[\d\D]+?<config-file\s+url="(\S+)"\s+\/>[\d\D]+?<\/chcp>/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: chcp config-file`);
        return $1.replace(reg, `${chcpData.android_chcp_content_url_prod}/chcp.json`);
      })
    )
    /** 修改 <widget  version="" */
    .pipe(
      replace(/<widget[\d|\D]+?version="([\d|\.]+)?"/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: version:${chcpData.android_prod_version}`);
        return $1.replace(reg, chcpData.android_prod_version);
      })
    )
    /** 修改 <native-interface version="" /> */
    .pipe(
      replace(/<chcp>[\d\D]+?<native-interface\s+version="(\d+)"\s+\/>/i, ($1, $2) => {
        const reg = new RegExp($2);
        console.log(`config.xml 内容替换: chcp native-interface version:${chcpData.android.min_native_interface}`);
        return $1.replace(reg, `${chcpData.android.min_native_interface}`);
      })
    )
    .pipe(gulp.dest('.'));
});

/** 
 * 设置 android cordova-hcp.json debug
 */
gulp.task('set-cordova-hcp-android-debug', () => {
  return gulp.src('./cordova-hcp.json')
    .pipe(replace(/[\d\D]+/, ($1) => {
      console.log(`设置 cordova-hcp.json`);
      console.log(JSON.stringify(chcpData.android, null, '\t'));
      chcpData.android.content_url = chcpData.android_chcp_content_url_debug;
      return JSON.stringify(chcpData.android, null, '\t');
    }))
    .pipe(gulp.dest('.'));
});

/** 
 * 设置 android cordova-hcp.json prod
 */
gulp.task('set-cordova-hcp-android-prod', () => {
  return gulp.src('./cordova-hcp.json')
    .pipe(replace(/[\d\D]+/, ($1) => {
      console.log(`设置 cordova-hcp.json`);
      console.log(JSON.stringify(chcpData.android, null, '\t'));
      chcpData.android.content_url = chcpData.android_chcp_content_url_prod;
      return JSON.stringify(chcpData.android, null, '\t');
    }))
    .pipe(gulp.dest('.'));
});

/**
 * 更新 dist/debug/android
 */
gulp.task('copy-hot-code-android-debug', gulp.series('set-release-android', 'clean-android-dir-debug', () => {
  const path = chcpData.android_local_path_debug;
  console.log(`更新 dist/debug/android`);
  return gulp.src('./platforms/android/app/src/main/assets/www/**/*')
    .pipe(gulp.dest(path));
}));

/**
 * 更新 dist/prod/android
 */
gulp.task('copy-hot-code-android-prod', gulp.series('set-release-android', 'clean-android-dir-prod', () => {
  const path = chcpData.android_local_path_prod;
  console.log(`更新 dist/debug/android`);
  return gulp.src('./platforms/android/app/src/main/assets/www/**/*')
    .pipe(gulp.dest(path));
}));


/** 
 * 设置 热更新文件
 */
gulp.task('set-hot-code-android-chcp-prod', gulp.series('set-config-xml-android-prod', 'set-cordova-hcp-android-prod'), (done) => {
  console.log('android 热更新文件配置完毕');
  done();
});

gulp.task('set-hot-code-android-chcp-debug', gulp.series('set-config-xml-android-debug', 'set-cordova-hcp-android-debug', (done) => {
  console.log('android 热更新文件配置完毕');
  done();
}));

