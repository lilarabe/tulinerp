(function () {

  var androidApkUrl = "https://hotfix.quanzhuejia.com/com_trendzone_tulinerp/android/app.apk";
  var iosBrowserUrl = "https://itunes.apple.com/cn/app/%E9%A1%B9%E7%9B%AE%E5%8D%8F%E4%BD%9C%E5%B9%B3%E5%8F%B0/id1453816111?mt=8";

  var Platform = function () {
    /** 返回值 */
    var result = {};
    var _userAgent = window.navigator.userAgent || '';
    var _mimeTypes = window.navigator.mimeTypes || {};
    /** 测试浏览器是否是360 急速 模式 */
    var _test360Chrome = function () {
      if (result.isChrome) {
        for (var mt in _mimeTypes) {
          /** 在window下有效 */
          if (_mimeTypes[mt]['type'] === 'application/vnd.chromium.remoting-viewer') {
            result.is360Chrome = true;
          }
          if (_mimeTypes[mt]['type'] === 'application/gameplugin') {
            result.is360Chrome = true;
          }
        }
        /** 测试 navigator 是否存在 userActivation属性 */
        if (window.navigator.userActivation) {
          // result.is360Chrome = true;
        }
      }
    };
    /** 测试浏览器是否是360 兼容 模式 */
    var _test360Ie = function () {
      var strConsoleLog = window.console.log.toString();
      if (result.isIe) {
        if (/log/i.test(strConsoleLog)) {
          result.is360Ie = true;
        }
      }
    };
    result.userAgent = _userAgent;
    result.browserInfo = {
      browserName: ''
    };
    result.isWxBrowser = _userAgent.indexOf('MicroMessenger') > -1;
    result.isAndroid = _userAgent.indexOf('Android') > -1 || _userAgent.indexOf('Adr') > -1;;
    result.isIos = !!_userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    result.isMobile = !!_userAgent.match(/AppleWebKit.*Mobile.*/);
    result.isIpad = _userAgent.indexOf('iPad') > -1;
    result.isIphone = _userAgent.indexOf('iPhone') > -1;
    result.isIe = _userAgent.indexOf('Trident') > -1;
    result.isPc = !result.isMobile;
    result.isChrome = !!window.chrome;
    /** 360急速 */
    result.is360Chrome = false;
    /** 360兼容 */
    result.is360Ie = false;
    _test360Chrome();
    _test360Ie();

    return result;
  };

  var platform = new Platform();

  // console.log(JSON.stringify('Chrome:' + platform.isChrome));
  // console.log(JSON.stringify('IE:' + platform.isIe));
  // console.log(JSON.stringify('360Chrome:' + platform.is360Chrome));
  // console.log(JSON.stringify('360Ie:' + platform.is360Ie));
  // console.log(window.console.log.toString());
  // console.log(/log/i.test(window.console.log.toString()));

  var msgElementRef = document.getElementById('download-msg');

  if (platform.isWxBrowser) {
    msgElementRef.innerText = '请在浏览器中打开';
  } else {
    if (platform.isAndroid) {
      window.location.href = androidApkUrl;
    } else if (platform.isIos) {
      window.location.href = iosBrowserUrl;
    } else {
      msgElementRef.innerText = '';
    }
  }

})();
