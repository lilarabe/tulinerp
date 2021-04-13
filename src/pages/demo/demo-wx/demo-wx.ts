import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WxV3NativeProvider } from "../../../serves/native/wx-v3";
import { WXShareParamsType, WXShareParamsTextType, WXShareParamsImageType, WXShareParamsLinkType, WXShareParamsMiniType, WXOpenParamsMiniType, WXAuthSuccessResultType, WXPayParamsType } from '../../../interface/wx/wx.native.interface';



@Component({
  selector: 'page-demo-wx',
  templateUrl: 'demo-wx.html',
})
export class DemoWxPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _wxNativeProvider: WxV3NativeProvider,
  ) {
  }

  ionViewDidLoad() {
  }

  public shareText = (): void => {
    const param: WXShareParamsTextType = {
      text: "要分享的文字1",
      scene: 0
    };
    this._wxNativeProvider.shareText(param).then(() => {
      alert('分享完成');
    });
  }

  public shareImage = (): void => {
    const param: WXShareParamsImageType = {
      image: "http://cdn.68design.net/work/thum/201812/qgahozksm6r3o222gbrm.jpg",
      scene: 0
    };
    this._wxNativeProvider.shareImage(param).then();
  }

  public shareLink = (): void => {
    const param: WXShareParamsLinkType = {
      title: '分享链接标题',
      description: '分享链接描述',
      thumb: 'assets/images/loginHeader.png',
      webpageUrl: 'http://www.wanmeiruzhu.com/',
      scene: 0
    };
    this._wxNativeProvider.shareLink(param).then();
  }

  public shareMiniProgram = (): void => {
    const param: WXShareParamsMiniType = {
      title: '小程序title1',
      thumb: 'assets/images/loginHeader.png',
      webpageUrl: 'http://www.wanmeiruzhu.com/',
      // username: "gh_f8ee05f77b06",
      username: 'gh_8b6dcf88532b',
      path: '/pages/index/index'
    };
    this._wxNativeProvider.shareMiniProgram(param).then();
  }

  public shareMiniProgramWithQuery = (): void => {
    const param: WXShareParamsMiniType = {
      title: '小程序title1',
      thumb: 'assets/images/loginHeader.png',
      webpageUrl: 'http://www.wanmeiruzhu.com/',
      // username: "gh_f8ee05f77b06",
      username: 'gh_8b6dcf88532b',
      path: '/pages/index/index',
      query: {a:'xxx', b:'yyy'},
      programType: 1,
    };
    this._wxNativeProvider.shareMiniProgram(param).then();
  }

  public shareMedia = (): void => {
    const params: WXShareParamsType = {
      scene: 0,
      message: {
        title: "标题",
        description: "描述",
        thumb: "assets/images/loginHeader.png",
        // thumb: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAKAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOTlFOURFRkMzOEYxMUU3OTlBOUY0MDE3RTcwRkU1OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyOTlFOURGMEMzOEYxMUU3OTlBOUY0MDE3RTcwRkU1OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI5OUU5REVEQzM4RjExRTc5OUE5RjQwMTdFNzBGRTU4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5OUU5REVFQzM4RjExRTc5OUE5RjQwMTdFNzBGRTU4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAFBAQGRIZJxcXJzImHyYyLiYmJiYuPjU1NTU1PkRBQUFBQUFERERERERERERERERERERERERERERERERERERERAEVGRkgHCAmGBgmNiYgJjZENisrNkREREI1QkRERERERERERERERERERERERERERERERERERERERERERERERERE/8AAEQgAdgB2AwEiAAIRAQMRAf/EAE0AAQEAAAAAAAAAAAAAAAAAAAAEAQEBAQAAAAAAAAAAAAAAAAAABAUQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJgGqiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z",
        mediaTagName: "mediaTagName",
        messageExt: "messageExt",
        messageAction: "messageAction",
        media: {
          type: 7,
          webpageUrl: "http://tech.qq.com/zt2012/tmtdecode/252.htm"
        }
      }
    };
    this._wxNativeProvider.shareMedia(params).then();
  }


  public openMiniProgram = (): void => {
    const param: WXOpenParamsMiniType = {
      // username: "gh_f8ee05f77b06",
      username: 'gh_8b6dcf88532b',
      path: '/pages/demo/demo',
      programType: 0,
    };
    this._wxNativeProvider.openMiniProgram(param).then();
  }

  public openMiniProgramWithQuery = (): void => {
    const param: WXOpenParamsMiniType = {
      username: 'gh_8b6dcf88532b',
      path: '/pages/demo/demo',
      programType: 1,
      query: { a: 1, b: 2, c: 3 },
    };
    this._wxNativeProvider.openMiniProgram(param).then();
  }

  public auth = (): void => {
    this._wxNativeProvider.auth().then((res: WXAuthSuccessResultType) => {
      // 获取 code 交给后台处理
    });
  }


  public pay = ():void => {
    const params: WXPayParamsType = {
      partnerid: '10000100', // merchant id
      prepayid: 'wx201411101639507cbf6ffd8b0779950874', // prepay id
      noncestr: '1add1a30ac87aa2db72f57a2375d8fec', // nonce
      timestamp: '1439531364', // timestamp
      sign: '0CB01533B8C1EF103065174F50BCA001',
    };
    this._wxNativeProvider.pay(params).then();
  }

}
