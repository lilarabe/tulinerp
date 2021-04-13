import { Injectable } from '@angular/core';
import * as WxType from '../interface/wx.jssdk.interface';
import { WxService } from './wx.service';
declare var wx: any;


@Injectable()
export class WxJsSdkService {

    /* 微信配置信息 */
    private _wxConfig: WxType.WxConfigType;
    public get wxConfig(): WxType.WxConfigType { return this._wxConfig; }
    public set wxConfig(v: WxType.WxConfigType) { this._wxConfig = v; }


    constructor(
        private _wxService: WxService,
    ) {
    }


    /**
     * 验证是否在微信
     * 
     * @private
     * @memberof WxJsSdkService
     */
    public isWeixn = (): boolean => {
        const reg1 = /micromessenger/i;
        const reg2 = /wxwork/i;
        const testReg1: boolean = reg1.test(navigator.userAgent.toLowerCase());
        const testReg2: boolean = reg2.test(navigator.userAgent.toLowerCase());
        return testReg1 === true && testReg2 === false;
    }

    /**
     * 验证是否在企业微信手机端
     * 
     * @private
     * @memberof WxJsSdkService
     */
    public isWxWorkMobile = (): boolean => {
        const reg1 = /micromessenger/i;
        const reg2 = /wxwork/i;
        const reg3 = /mobile/i;
        const testReg1: boolean = reg1.test(navigator.userAgent.toLowerCase());
        const testReg2: boolean = reg2.test(navigator.userAgent.toLowerCase());
        const testReg3: boolean = reg3.test(navigator.userAgent.toLowerCase());
        return testReg1 === true && testReg2 === true && testReg3 === true;
    }
    /**
     * 验证是否在企业微信PC端
     * 
     * @private
     * @memberof WxJsSdkService
     */
    public isWxWorkPc = (): boolean => {
        const reg1 = /micromessenger/i;
        const reg2 = /wxwork/i;
        const reg3 = /windows/i;
        const testReg1: boolean = reg1.test(navigator.userAgent.toLowerCase());
        const testReg2: boolean = reg2.test(navigator.userAgent.toLowerCase());
        const testReg3: boolean = reg3.test(navigator.userAgent.toLowerCase());
        return testReg1 === true && testReg2 === true && testReg3 === true;
    }

    /* 打印信息 */
    // private _print = (msg: any): void => {
    //     if (this.debug) alert(msg);
    // }
    /** 验证 config */
    public ready = async (config: WxType.WxConfigType): Promise<any> => {
        return new Promise((resolve) => {
            /** 通过config接口注入权限验证配置 */
            wx.config(config);
            /** 通过ready接口处理成功验证 */
            wx.ready(() => {
                /**
                 * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
                 * config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
                 * 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                 * 则可以直接调用，不需要放在ready函数中。
                 */
                resolve(true);
            });
            /** 通过error接口处理失败验证 */
            wx.error((res) => {
                /**
                 * config信息验证失败会执行error函数，如签名过期导致验证失败，
                 * 具体错误信息可以打开config的debug模式查看，
                 * 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                 */
                resolve(false);
            });
        });
    }

    /** 通过agentConfig注入应用的权限 */
    public agentConfig = async (config: WxType.WxAgentConfigType): Promise<any> => {
        return new Promise((resolve) => {
            alert(wx.agentConfig);
            wx.ready(() => {
                wx.agentConfig({
                    corpid: config.corpid,
                    agentid: config.agentid,
                    timestamp: config.timestamp,
                    nonceStr: config.nonceStr,
                    signature: config.signature,
                    jsApiList: config.jsApiList,
                    success: function (res) {
                        alert(`成功；${JSON.stringify(res)}`);
                        resolve(true);
                    },
                    fail: function (res) {
                        if (res.errMsg.indexOf('function not exist') > -1) {
                            alert('版本过低请升级')
                        }
                        resolve(false);
                    }
                });
            });
            wx.error((res) => {
                resolve(false);
            });

        });
    }

    /** 获取地理位置接口 */
    public getLocation = async (): Promise<any> => {
        return new Promise(async (resolve) => {
            const result = { lat: 0, lng: 0 };
            const config: WxType.WxConfigType = await this._wxService.getJssdkConfig();
            const isOk: boolean = await this.ready(config);
            if (isOk) {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res: any) {
                        let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        // let speed = res.speed; // 速度，以米/每秒计
                        // let accuracy = res.accuracy; // 位置精度
                        result.lat = latitude;
                        result.lng = longitude;
                        resolve(result);
                    }
                });
            } else {
                resolve(result);
            }
        });
    }

    /** 监听页面返回事件 */
    public onHistoryBack = async (): Promise<any> => {
        
        return new Promise(async (resolve) => {
            let result = false;
            const config: WxType.WxConfigType = await this._wxService.getJssdkConfig();
            const isOk: boolean = await this.ready(config);
            if (isOk) {
                wx.onHistoryBack(function(){
                    wx.closeWindow();
                    result = true;
                    return result;
                });
            }
            resolve(result);
        });
    }


    /** 使用企业微信内置地图查看位置接口 */
    public openLocation = async () => {

    }



    // 分享接口

    /**
     * 分享到朋友圈
     * 
     * @memberof WxJsSdkService
     */
    // public shareTimeline = (options: WxType.ShareTimelineType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareTimeline(options);
    //     });
    // }

    /**
     * 分享给朋友
     * 
     * @memberof WxJsSdkService
     */
    // public shareAppMessage = (options: WxType.ShareAppMessageType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareAppMessage(options);
    //     });
    // }

    /**
     * 分享到QQ
     * 
     * @memberof WxJsSdkService
     */
    // public shareQQ = (options: WxType.ShareQQType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareQQ(options);
    //     });
    // }

    /**
     * 分享到腾讯微博
     * 
     * @memberof WxJsSdkService
     */
    // public shareWeibo = (options: WxType.ShareWeiboType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareWeibo(options);
    //     });
    // }

    /**
     * 分享到QQ空间
     * 
     * @memberof WxJsSdkService
     */
    // public shareQZone = (options: WxType.ShareQZoneType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareQZone(options);
    //     });
    // }

    /**
     * 分享：朋友圈，朋友，QQ，腾讯微博，QQ空间
     * 
     * @memberof WxJsSdkService
     */
    // public share = (options: WxType.ShareType, url: string = document.location.href) => {
    //     this.ready(url).subscribe(res => {
    //         wx.onMenuShareTimeline(options);
    //         wx.onMenuShareAppMessage(options);
    //         wx.onMenuShareQQ(options);
    //         wx.onMenuShareWeibo(options);
    //         wx.onMenuShareQZone(options);
    //     });
    // }

    // 音频接口

    /**
     * 开始录音接口
     * 
     * @memberof WxJsSdkService
     */
    // public startRecord = (url: string = document.location.href): void => {
    //     this.ready(url).subscribe(() => {
    //         wx.startRecord();
    //     });
    // }

    /**
     * 停止录音接口
     * 
     * @memberof WxJsSdkService
     */
    // public stopRecord = (url: string = document.location.href): void => {
    //     this.ready(url).subscribe(() => {
    //         wx.stopRecord({
    //             success: (res) => {
    //                 this.recordLocalId = res.localId;
    //             }
    //         });
    //     });
    // }

    /**
     * 播放语音接口
     * 
     * @private
     * @memberof WxJsSdkService
     */
    // public playVoice = (url: string = document.location.href): void => {
    //     this.ready(url).subscribe(() => {
    //         wx.playVoice({
    //             localId: this.recordLocalId
    //         });
    //     });
    // }


    /**
     * 识别音频并返回识别结果接口
     * 
     * @memberof WxJsSdkService
     */
    // public translateVoice = (url: string = document.location.href): void => {
    //     this.ready(url).subscribe(() => {
    //         wx.translateVoice({
    //             localId: this.recordLocalId, // 需要识别的音频的本地Id，由录音相关接口获得
    //             isShowProgressTips: 1, // 默认为1，显示进度提示
    //             success: function (res) {
    //                 alert(res.translateResult); // 语音识别的结果
    //             }
    //         });
    //     });
    // }






}