module.exports = {
  ios: {
    "autogenerated": true,
    "name": "tulin-erp",
    "ios_identifer":"cn.tulin.erp",
    "android_identifer":"cn.tulin.erp",
    "min_native_interface": 1,
    "content_url": "",
    "update": "now"
  },
  android: {
    "autogenerated": true,
    "min_native_interface": 1,
    "name": "tulin-erp",
    "ios_identifer":"cn.tulin.erp",
    "android_identifer":"cn.tulin.erp",
    "content_url": "",
    "update": "now"
  },

  environments_dataUrl_prod: "https://edemo.quanzhuyun.com/mapp_port/",
  environments_dataUrl_debug: "https://edemo.quanzhuyun.com/mapp_port/",
  /** 文件路径 */
  fileBaseUrl_prod: "https://edemo.quanzhuyun.com/uploadfiles/qjjfwpt_dev/temp/",
  fileBaseUrl_debug: "https://edemo.quanzhuyun.com/uploadfiles/qjjfwpt_dev/temp/",

  /** 本地路径 */
  local_path: "./dist/cn_tulin_erp",
  local_path_debug: "./dist/cn_tulin_erp/debug",
  local_path_prod: "./dist/cn_tulin_erp/prod",

  /** ios 热更新服务器地址 */
  ios_server_path: "Z:\/hotcode\/cn_tulin_erp\/ios",
  /** android 热更新服务器地址 */
  android_server_path: "Z:\/hotcode\/cn_tulin_erp\/android",
  /** debug 热更新服务器地址 */
  serve_path_debug: "Z:\/hotcode\/cn_tulin_erp",
  /** prod 热更新服务器地址 */
  serve_path_prod: "Z:\/hotcode\/cn_tulin_erp",

  browser_local_path_prod: "./dist/cn_tulin_erp/prod/browser",
  browser_local_path_debug: "./dist/cn_tulin_erp/debug/browser",

  ios_local_path_debug: "./dist/cn_tulin_erp/debug/ios",
  ios_local_path_prod: "./dist/cn_tulin_erp/prod/ios",

  android_local_path_debug: "./dist/cn_tulin_erp/debug/android",
  android_local_path_prod: "./dist/cn_tulin_erp/prod/android",

  android_chcp_content_url_debug: "https://edemo.quanzhuyun.com/uploadfiles/hotcode/cn_tulin_erp/android",
  android_chcp_content_url_prod: "https://edemo.quanzhuyun.com/uploadfiles/hotcode/cn_tulin_erp/android",

  ios_chcp_content_url_debug: "https://edemo.quanzhuyun.com/uploadfiles/hotcode/cn_tulin_erp/ios",
  ios_chcp_content_url_prod: "https://edemo.quanzhuyun.com/uploadfiles/hotcode/cn_tulin_erp/ios",


  android_debug_version: '1.0.0',
  android_prod_version: '1.0.0',

  ios_debug_version: '1.0.0',
  ios_prod_version: '1.0.0',

  /** 微信appId */
  wechatAppid: 'wxe0bdf1ce68691713',
  /** 极光推送Id */
  jpushId: 'b36edd8fa53bfa717102c8b0',

  config_xml: {
    prod: {
      name: "tulin-erp",
      id: "cn.tulin.erp",
    },
    debug: {
      name: "tulin-erp",
      id: "cn.tulin.erp",
    }
  }
}

