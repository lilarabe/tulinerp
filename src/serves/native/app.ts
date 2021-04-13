import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { ToolsProvider } from "../tools.service";


/**
 * @description 其他的app操作
 * 常用app名称:
 * 微信:{ios:'"weixin://', android:'com.tencent.mm'}}
 * @author da
 * @export
 * @class AppProvider
 */
@Injectable()
export class AppProvider {

    private _isDebug: boolean = true;

    private _isApp: boolean = this._platform.is('cordova');

    private _isAndroid: boolean = this._platform.is('android');

    private _isIos: boolean = this._platform.is('ios');

    constructor(
        private _platform: Platform,
        private _appAvailability: AppAvailability,
        private _tools: ToolsProvider,
    ) {
    }




    /**
     * @description 检查是否安装app
     * @private
     * @memberof AppProvider
     */
    private check = (appId: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (this._isApp) {
                this._appAvailability.check(appId).then(
                    (yes: boolean) => {
                        resolve(true);
                    },
                    (no: boolean) => {
                        /* 未安装，请编写提示代码或跳转下载 */
                        this._tools.printDebugMsg(`未安装${appId}`, this._isDebug);
                        reject(false);
                    }
                );
            } else {
                const msg: any = `检查是否安装app报错:不在APP中`;
                this._tools.printDebugMsg(msg, this._isDebug);
                reject(msg);
            }
        });
    };



    /**
     * @description 打开App
     * @memberof AppProvider
     */
    public launchApp = (appName: string, appPackageName?: AppPackageNameType): Promise<boolean> => {
        let appId: string = '';
        if (appPackageName) {
            appName = appPackageName.app
            if (this._isAndroid) {
                appId = appPackageName.packageName;
            } else if (this._isIos) {
                appId = appPackageName.urlScheme;
            }
        } else {
            for (const v of appPackageNames) {
                if( v.app === appName ){
                    if (this._isAndroid) {
                        appId = v.packageName;
                    } else if (this._isIos) {
                        appId = v.urlScheme;
                    }
                    break;
                }
            }
        }
        return new Promise((resolve, reject) => {
            if (this._isApp) {
                this.check(appId).then(() => {
                    const option: object = { 
                        // "action": "ACTION_MAIN", // ACTION_VIEW, ACTION_MAIN
                        "package": appId,
                    };
                    const appStarter = (window as any).startApp.set(option);
                    console.log(appStarter);
                    appStarter.start(
                        (msg) => {
                            this._tools.printDebugMsg(`${appName}打开成功`, this._isDebug);
                            this._tools.printDebugMsg(msg, this._isDebug);
                            resolve(true);
                        },
                        (err) => {
                            this._tools.printDebugMsg(`${appName}打开失败`, this._isDebug);
                            this._tools.printDebugMsg(err, this._isDebug);
                            reject();
                        }
                    );
                });
            } else {
                const msg: any = `打开App报错:不在APP中`;
                this._tools.printDebugMsg(msg, this._isDebug);
                reject(msg);
            }
        });
    }

}

/** 常用移动应用 Packagename 和 URL Scheme */
export const appPackageNames: Array<AppPackageNameType> = [
    { app: '支付宝', packageName: 'com.eg.android.AlipayGphone', urlScheme: 'alipay://' },
    { app: '淘宝', packageName: 'com.taobao.taobao', urlScheme: 'taobao://' },
    { app: 'QQ', packageName: 'com.tencent.mobileqq', urlScheme: 'mqq://' },
    { app: '微信', packageName: 'com.tencent.mm', urlScheme: 'weixin://' },
    { app: '爱奇艺', packageName: 'com.qiyi.video', urlScheme: 'qiyi-iphone://' },
    { app: '京东', packageName: 'com.jingdong.app.mall', urlScheme: 'openApp.jdMobile://' },
    { app: 'QQ音乐', packageName: 'com.tencent.qqmusic', urlScheme: 'qqmusic://' },
    { app: '唯品会', packageName: 'com.achievo.vipshop', urlScheme: 'vipshop://' },
    { app: '美图秀秀', packageName: 'com.mt.mtxx.mtxx', urlScheme: 'mtxx.open://' },
    { app: '优酷', packageName: 'com.youku.phone', urlScheme: 'youku://' },
    { app: '手机百度', packageName: 'com.baidu.searchbox', urlScheme: 'baiduboxapp://' },
    { app: '腾讯视频', packageName: 'com.tencent.qqlive', urlScheme: 'tenvideo://' },
    { app: '天猫', packageName: 'com.tmall.wireless', urlScheme: 'tmall://' },
    { app: '大众点评', packageName: 'com.dianping.v1', urlScheme: 'dianping://' },
    { app: '微博', packageName: 'com.sina.weibo', urlScheme: 'sinaweibo://' },
    { app: '饿了么', packageName: 'me.ele', urlScheme: 'eleme://' },
    { app: '滴滴出行', packageName: 'com.sdu.didi.psnger', urlScheme: 'diditaxi://' },
    { app: '搜狗输入法', packageName: 'com.sohu.inputmethod.sogou', urlScheme: 'com.sogou.sogouinput://' },
    { app: 'UC 浏览器', packageName: 'com.UCMobile', urlScheme: 'ucbrowser://' },
    { app: '腾讯新闻', packageName: 'com.tencent.news', urlScheme: 'qqnews://' },
    { app: '携程旅行', packageName: 'ctrip.android.view', urlScheme: 'ctrip://' },
    { app: '快手', packageName: 'com.smile.gifmaker', urlScheme: 'gifshow://' },
    { app: '去哪儿旅行', packageName: 'com.Qunar', urlScheme: 'QunarAliPay://' },
    { app: '今日头条', packageName: 'com.ss.android.article.news', urlScheme: 'snssdk141://' },
    { app: '搜狐视频', packageName: 'com.sohu.sohuvideo', urlScheme: 'sohuvideo-iphone://' },
    { app: '蘑菇街', packageName: 'com.mogujie', urlScheme: 'mogujie://' },
    { app: '酷我音乐', packageName: 'cn.kuwo.player', urlScheme: 'alipayKuwoMusic://' },
    { app: '58同城', packageName: 'com.wuba', urlScheme: 'wbmain://' },
    { app: '喜马拉雅', packageName: 'com.ximalaya.ting.android', urlScheme: 'iting://' },
    { app: '乐视视频', packageName: 'com.letv.android.client', urlScheme: 'LetviPhone://' },
    { app: '铁路12306', packageName: 'com.MobileTicket', urlScheme: 'cn.12306://' },
    { app: '陌陌', packageName: 'com.immomo.momo', urlScheme: 'momochat://' },
    { app: 'QQ 浏览器', packageName: 'com.tencent.mtt', urlScheme: 'mttbrowser://' },
    { app: '土豆视频', packageName: 'com.tudou.android', urlScheme: 'tudou://' },
    { app: '聚美优品', packageName: 'com.jm.android.jumei', urlScheme: 'JuMei://' },
    { app: '墨迹天气', packageName: 'com.moji.mjweather', urlScheme: 'rm434209233MojiWeather://' },
    { app: '芒果TV', packageName: 'com.hunantv.imgo.activity', urlScheme: 'imgotv://' },
    { app: '唱吧', packageName: 'com.changba', urlScheme: 'changba://' },
    { app: 'K歌达人', packageName: 'com.app.hero.ui', urlScheme: 'okehero://' },
    { app: '酷狗音乐', packageName: 'com.kugou.android', urlScheme: 'KugouKtvUrl://' },
    { app: '中华万年历', packageName: 'cn.etouch.ecalendar', urlScheme: 'zhwnl://' },
    { app: 'PPTV聚力', packageName: 'com.pplive.androidphone', urlScheme: 'pptv://' },
    { app: '网易新闻', packageName: 'com.netease.newsreader.activity', urlScheme: 'newsapp://' },
    { app: '百度贴吧', packageName: 'com.baidu.tieba', urlScheme: 'com.baidu.tieba://' },
    { app: '暴风影音', packageName: 'com.storm.smart', urlScheme: 'com.baofeng.play://' },
    { app: '有道词典', packageName: 'com.youdao.dict', urlScheme: 'yddictproapp://' },
    { app: '蜻蜓FM', packageName: 'fm.qingting.qtradio', urlScheme: 'qtfmwr://' },
    { app: '360浏览器', packageName: 'com.qihoo.browser', urlScheme: 'qihoobrowser://' },
    { app: '我查查', packageName: 'com.wochacha', urlScheme: 'wcc://' },
    { app: '书旗小说', packageName: 'com.shuqi.controller', urlScheme: 'tencent100730840://' },
    { app: '风行视频', packageName: 'com.funshion.video.mobile', urlScheme: 'funshionmovieiphone://' },
    { app: '美妆相机', packageName: 'com.meitu.makeup', urlScheme: 'mzxj://' },
    { app: '美颜相机', packageName: 'com.meitu.meiyancamera', urlScheme: 'myxj://' },
    { app: 'Camera 360', packageName: 'vStudio.Android.Camera360', urlScheme: 'Camera360://' },
    { app: '美拍', packageName: 'com.meitu.meipaimv', urlScheme: 'mtmv://' },
    { app: '百度地图', packageName: 'com.baidu.BaiduMap', urlScheme: 'baidumap://' },
    { app: '高德地图', packageName: 'com.autonavi.minimap', urlScheme: 'amapuri://' },
    { app: '腾讯地图', packageName: 'com.tencent.map', urlScheme: 'qqmap://' },
    { app: '谷歌地图', packageName: 'com.google.android.apps.maps', urlScheme: 'google.navigation:q=' },
];


export interface AppPackageNameType {
    /** app名称 */
    app: string;
    /** android 包名 */
    packageName: string;
    /** ios Url Scheme */
    urlScheme: string;
}