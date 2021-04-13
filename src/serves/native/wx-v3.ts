import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ToolsProvider } from "../tools.service";
import { MsgService } from '../msg.service';
import { WechatChenyu } from "wechat-chenyu";
import { WXShareParamsType, WXShareParamsTextType, WXShareParamsImageType, WXShareParamsLinkType, WXShareParamsMiniType, WXOpenParamsMiniType, WXAuthSuccessResultType, WXPayParamsType } from '../../interface/wx/wx.native.interface';
import { CanvasBase64Service } from '../canvas-base64.service';



/**
 * @description 只能使用 cordova-plugin-wechat-v3 插件
 * ionic cordova plugin add cordova-plugin-wechat-v3 --variable wechatappid=wxe0bdf1ce68691713
 * @author da
 * @export
 * @class WxV3NativeProvider
 */
@Injectable()
export class WxV3NativeProvider {

    private _isDebug: boolean = false;

    private _isApp: boolean = this._platform.is('cordova');

    constructor(
        protected _wechatChenyu: WechatChenyu,
        protected _platform: Platform,
        protected _tools: ToolsProvider,
        protected _msg: MsgService,
        protected _canvasBase64Service: CanvasBase64Service,
    ) {
    }


    /**
     * @description 检查
     * @protected
     * @memberof WxNativeProvider
     */
    protected _check = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            /** 判断是否在APP中 */
            if (this._isApp) {
                /** 判断是否安装微信 */
                this._wechatChenyu.isInstalled().then(
                    (installed: number) => {
                        if (installed) {
                            resolve(true);
                        } else {
                            const msg: any = `分享到微信报错:没有安装微信`;
                            this._tools.printDebugMsg(msg, this._isDebug);
                            this._msg.toast('您没有安装微信');
                            reject(msg);
                        }
                    },
                    (reason) => {
                        const msg: any = `分享到微信报错:没有安装微信:${reason}`;
                        this._tools.printDebugMsg(msg, this._isDebug);
                        this._msg.toast('您没有安装微信');
                        reject(msg);
                    }
                );

            } else {
                const msg: any = `分享到微信报错:不在APP中`;
                this._tools.printDebugMsg(msg, this._isDebug);
                reject(msg);
            }
        });
    }


    /**
     * @description 分享
     * @memberof WxNativeProvider
     */
    private _share = (params: WXShareParamsType): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._check().then(() => {
                /**
                 * 开启loading, cordova开启微信太慢，防止多次点击
                 */
                const loader = this._msg.loading('分享载中...');
                loader.present();
                /** 
                 * 强行关闭loading，如果分享完毕停留在微信中，无法触发回调 
                */
                setTimeout(() => {
                    loader.dismiss();
                }, 5000);
                this._wechatChenyu.share(params).then(
                    (res) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`分享成功`, this._isDebug);
                        this._tools.printDebugMsg(res, this._isDebug);
                        resolve(true);
                    },
                    (err) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`分享失败`, this._isDebug);
                        this._tools.printDebugMsg(err, this._isDebug);
                        reject();
                    }
                );

            });
        });
    }


    /**
     * @description 分享媒体
     * @memberof WxNativeProvider
     */
    public shareMedia = (params: WXShareParamsType): Promise<any> => {
        return new Promise((resolve, reject) => {
            /** 
             * 如果存在将图片转换base64
             */
            if (params.message && params.message.thumb) {
                this._canvasBase64Service.getBase64Code(params.message.thumb, { case: 'define', width: 400, height: 400 }).then((base64) => {
                    params.message.thumb = base64;
                    this._share(params).then(() => { resolve(true); });
                });
            } else {
                this._share(params).then(() => { resolve(true); });
            }

        });
    }


    /**
     * @description 分享文字
     * @param text:分享文字, scene:分享场景
     * @memberof WxNativeProvider
     */
    public shareText = (param: WXShareParamsTextType): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.shareMedia(param).then(() => {
                resolve(true);
            });
        });
    }


    /**
     * @description 分享图片
     * @memberof WxNativeProvider
     */
    public shareImage = (param: WXShareParamsImageType): Promise<any> => {
        const params: WXShareParamsType = {
            scene: param.scene,
            message: {
                title: '', description: '',
                media: {
                    type: 4, image: param.image,
                }
            },
        };
        return new Promise((resolve, reject) => {
            this.shareMedia(params).then(() => {
                resolve(true);
            });
        });
    }



    /**
     * @description 分享链接
     * title: 标题, description: 描述, thumb: 缩略图, webpageUrl: 网址, scene: 场景
     * @memberof WxNativeProvider
     */
    public shareLink = (param: WXShareParamsLinkType): Promise<any> => {
        const params: WXShareParamsType = {
            scene: param.scene,
            message: {
                title: param.title,
                description: param.description,
                thumb: param.thumb,
                media: {
                    type: 7,
                    webpageUrl: param.webpageUrl
                }
            },
        };
        return new Promise((resolve, reject) => {
            this.shareMedia(params).then(() => {
                resolve(true);
            });
        });
    }



    /**
     * @description 分享小程序
     * @memberof WxNativeProvider
     */
    public shareMiniProgram = (param: WXShareParamsMiniType): Promise<any> => {
        const params: WXShareParamsType = {
            scene: 0,
            message: {
                title: param.title,
                description: '',
                thumb: param.thumb,
                media: {
                    type: 8,
                    webpageUrl: param.webpageUrl,
                    programType: param.programType ? param.programType : 0,
                    username: param.username,
                    path: param.path
                }
            },
        };
        /** 启动参数设置 */
        if (this._tools.isNotNullObject(param.query)) {
            if (~param.path.indexOf('?')) {
                params.message.media.path = `${param.path}&${this._tools.param(param.query)}`;
            } else {
                params.message.media.path = `${param.path}?${this._tools.param(param.query)}`;
            }
        }
        this._tools.printDebugMsg(params, this._isDebug);
        return new Promise((resolve, reject) => {
            this.shareMedia(params).then(() => {
                resolve(true);
            });
        });
    }



    /**
     * @description 打开微信小程序
     * @memberof WxNativeProvider
     */
    public openMiniProgram = (param: WXOpenParamsMiniType): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._check().then(() => {
                /**
                * 开启loading, cordova开启微信太慢，防止多次点击
                */
                const loader = this._msg.loading('打开小程序...');
                loader.present();
                /** 
                 * 强行关闭loading，如果分享完毕停留在微信中，无法触发回调 
                */
                setTimeout(() => {
                    loader.dismiss();
                }, 3000);
                const params: any = {
                    scene: 0,
                    message: {}
                };
                params.message.username = param.username;
                params.message.path = param.path;
                /** 启动参数设置 */
                if (this._tools.isNotNullObject(param.query)) {
                    if (~param.path.indexOf('?')) {
                        params.message.path = `${param.path}&${this._tools.param(param.query)}`;
                    } else {
                        params.message.path = `${param.path}?${this._tools.param(param.query)}`;
                    }
                }
                /** 正式版:0, 开发版:1, Preview:2 */
                params.message.programType = param.programType ? param.programType : 0;
                this._tools.printDebugMsg(params, this._isDebug);
                (window as any).Wechat.openMiniProgram(
                    params,
                    (data) => {
                        loader.dismiss();
                        resolve(data);
                        this._tools.printDebugMsg(data, this._isDebug);
                    },
                    (error) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(error, this._isDebug);
                    }
                );
            });
        });
    }



    /**
     * @description 微信授权登陆
     * 参考：
     * https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317851&token=5fde887dc9d41433b0f58c431d3d37042dc1bd56&lang=zh_CN
     * @memberof WxV3NativeProvider
     */
    public auth = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._check().then(() => {
                /**
                 * 开启loading, cordova开启微信太慢，防止多次点击
                 */
                const loader = this._msg.loading('打开微信...');
                loader.present();
                /** 
                 * 强行关闭loading，如果分享完毕停留在微信中，无法触发回调 
                */
                setTimeout(() => {
                    loader.dismiss();
                }, 5000);

                /** 
                 * 应用授权作用域，如获取用户个人信息则填写snsapi_userinfo
                 */
                const scope: string = 'snsapi_userinfo';
                /**
                 * 用于保持请求和回调的状态，授权请求后原样带回给第三方。
                 * 该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，
                 * 可设置为简单的随机数加session进行校验
                 */
                const state: string = `${this._tools.getRandomChars(6)}_${+new Date()}`;
                this._wechatChenyu.auth(scope, state).then(
                    (res: WXAuthSuccessResultType) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`授权成功`, this._isDebug);
                        this._tools.printDebugMsg(res, this._isDebug);
                        resolve(res);
                    },
                    (err) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`授权失败`, this._isDebug);
                        this._tools.printDebugMsg(err, this._isDebug);
                        reject();
                    }
                );

            });
        });
    }




    /**
     * @description 支付
     * @memberof WxV3NativeProvider
     */
    public pay = (param: WXPayParamsType): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._check().then(() => {
                /**
                 * 开启loading, cordova开启微信太慢，防止多次点击
                 */
                const loader = this._msg.loading('打开微信...');
                loader.present();
                /** 
                 * 强行关闭loading，如果分享完毕停留在微信中，无法触发回调 
                */
                setTimeout(() => {
                    loader.dismiss();
                }, 5000);

                this._wechatChenyu.sendPaymentRequest(param).then(
                    (res: WXAuthSuccessResultType) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`支付成功`, this._isDebug);
                        this._tools.printDebugMsg(res, this._isDebug);
                        resolve(res);
                    },
                    (err) => {
                        loader.dismiss();
                        this._tools.printDebugMsg(`支付失败`, this._isDebug);
                        this._tools.printDebugMsg(err, this._isDebug);
                        reject();
                    }
                );

            });
        });
    }

}