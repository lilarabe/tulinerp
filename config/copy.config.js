module.exports = {
  // copyWorkbox: {
  //   src: ['./node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js'],
  //   dest: '{{WWW}}'
  // },
  copyFonts: {
    src: [
      '{{ROOT}}/node_modules/ionicons/dist/fonts/**/*',
      '{{ROOT}}/node_modules/ionic-angular/fonts/**/*',
      // '{{ROOT}}/node_modules/material-design-icons/iconfont/**/*' // material 字体
      '{{ROOT}}/node_modules/videogular2/fonts/**/*',
    ],
    dest: '{{WWW}}/assets/fonts'
  },
  copyIndexContent: {
    src: [
      '{{SRC}}/index.html', 
      '{{SRC}}/download.html',
      '{{SRC}}/auth.html',
      '{{SRC}}/download.js',
      '{{SRC}}/manifest.json', 
      '{{SRC}}/service-worker.js', 
      '{{SRC}}/config.js',
      '{{SRC}}/browser.js',
      '{{SRC}}/sw.js',
    ],
    dest: '{{WWW}}'
  },
}
