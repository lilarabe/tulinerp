import { Component } from '@angular/core';
// import { Location } from '@angular/common';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HotCodeService } from '../serves/native/hot-code.service';
import { DebugService } from '../serves/debug.service';
import { JpushService } from '../serves/native/jpush';
import { BaiduMapService } from '../serves/baidu-map.service';
import { AjaxService } from '../serves/ajax.service';
import { AppGlobalType } from '../interface/global.interface';
import { WxJsSdkService } from '../serves/wx-js-sdk.service';
import { WxService } from '../serves/wx.service';


declare const app_global: AppGlobalType;
// import { GeolocationService } from '../serves/native/geolocation.service';
declare var Date: any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  /** 主题名称 */
  public themeName: string = 'default-theme';
  /** 是否企业pc端 */
  public isWxWorkPc: boolean = false;

  public isIphone: boolean = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _jpush: JpushService,
    private screenOrientation: ScreenOrientation,
    private hotCode: HotCodeService,
    private _debugService: DebugService,
    private _events: Events,
    private _baiduMap: BaiduMapService,
    private _ajax: AjaxService,
    private _wxJsSdkService: WxJsSdkService,
    // private _tools: ToolsProvider,
    private _wxService: WxService,
    // private _msg: MsgService,
    // private _geolocationService: GeolocationService,
  ) {
    // alert(window.location.href);
    // this.rootPage = MenuPage;

    /*通过查询手机型号来进行适配*/
    if (/iphone/gi.test(navigator.userAgent)) {
      this.isIphone = true;
    }

    Date.prototype.format = function (fmt) { //author: meizz 
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }


    /** 监控主题改变 */
    this._events.subscribe('changeThemeEvent', (themeName: string) => {
      this.themeName = themeName;
    });
    platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      statusBar.overlaysWebView(false);
      /* 验证是否在 app 中 */
      if (platform.is('cordova')) {
        /* 更新APP */
        await this.hotCode.hotCodeUpdate();
        /* 极光推送 */
        this._jpush.jpushInit();
        /* 锁定屏幕 - 竖屏 */
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        /* 锁定屏幕 - 横屏 */
        //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        /** 开启定位 */
        // this._geolocationService.getGeolocation();
      }
      /** 启动debug调试 */
      this._debugService.setDebugs().then();
      /** 开启百度地图api */
      this._baiduMap.init();
      /** 是否在企业微信手机端 */
      app_global.isWxWorkMobile = this._wxJsSdkService.isWxWorkMobile();
      /** 是否在企业微信手机端 */
      app_global.isWxWorkPc = this._wxJsSdkService.isWxWorkPc();


      if (app_global.isWxWorkMobile || app_global.isWxWorkPc) {

        await this._wxService.wxAutoLogin();

        this._wxJsSdkService.onHistoryBack();

      }


      /** 是否审批后自动关闭单据 */
      // this._ajax.loadData({
      //   title: '获取配置信息',
      //   uri: 'User_config.php',
      //   method: 'get',
      // }).subscribe(res => {
      //   if (res.status === 1 && res.payload.Approval_Close == 1) {
      //     app_global.isApprovedClose = true;
      //   }
      // });
      // await this.getUserConfig();

      /** 是否在企业微信PC端 */
      this.isWxWorkPc = this._wxJsSdkService.isWxWorkPc();

      this.rootPage = TabsPage;


    });

  }

  /** 是否审批后自动关闭单据 */
  public getUserConfig = (): Promise<void> => {
    return new Promise((resolve) => {
      this._ajax.loadData({
        title: '获取配置信息',
        uri: 'User_config.php',
        method: 'get',
      }).subscribe(res => {
        if (res.status === 1 && res.payload.Approval_Close == 1) {
          app_global.isApprovedClose = true;
        }
        resolve();
      });
    });
  }

}


