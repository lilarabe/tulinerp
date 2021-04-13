import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { PrintMsgService } from '../../components/print-msg/print-msg';
import { MsgService } from '../msg.service';

/* 极光推送 */
@Injectable()
export class JpushService {

    private _toggle: boolean = true;

    private _debug: boolean = false;

    private _isApp: boolean = this._platform.is('cordova');

    private _isAndroid: boolean = this._platform.is('android');

    private _isIos: boolean = this._platform.is('ios');

    private _registrationId: string = '';

    constructor(
        private _platform: Platform,
        private _jpush: JPush,
        private _printMsg: PrintMsgService,
        private _msg: MsgService,
    ) {
    }

    /** jpush 初始化 */
    public jpushInit = (): void => {
        this._platform.ready().then(() => {
            if (this._isApp && this._toggle) {
                /** 初始化 */
                this._jpush.init()
                    .then(() => {
                        this._printMsg.print(``, '极光推送:初始化 - 成功', this._debug);
                    })
                    .catch(error => {
                        this._printMsg.print(error, '极光推送:初始化 - 错误', this._debug);
                    });
                /** 设置角标 */
                this._jpush.setApplicationIconBadgeNumber(0);
                /** 设置debug */
                this._jpush.setDebugMode(true);
                this._openNotification();
                this._setRegistrationID();
                this._receiveNotification();
                this._receiveRegistrationId();
                this.getUserNotificationSettings();
            }
        });
    }

    /** 极光推送开关 */
    public setToggle = (toggle: boolean): void => {
        this._toggle = toggle;
        if (this._toggle) {
            this.jpushInit();
        }
        this._msg.toast(`注意:APP重启后生效`);
    }

    /** 是否开启 */
    public getToggle = (): boolean => {
        return this._toggle;
    }

    /** 设置debug */
    public setDebug = (bool: boolean): void => {
        this._debug = bool;
    }

    /** 获取 RegistrationID */
    public getRegistrationID = (): string => {
        return this._registrationId;
    }

    /** 点击推送通知 */
    private _openNotification = (): void => {
        const onOpenNotification = (event: any) => {
            if (this._isAndroid) {
                this._printMsg.print(event, 'jpush-open-android', this._debug);
            } else if (this._isIos) {
                this._printMsg.print(event, 'jpush-open-ios', this._debug);
            }
        };
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
    }

    /** 前台收到推送 - 应用程序处于前台时收到推送会触发该事件 */
    private _receiveNotification = (): void => {
        const onReceiveNotification = (event: any) => {
            if (this._isAndroid) {
                this._printMsg.print(event, 'jpush-receive-android', this._debug);
            } else if (this._isIos) {
                this._printMsg.print(event, 'jpush-receive-ios', this._debug);
            }
        }
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false)
    }

    /** 注册成功事件 只触发一次 */
    private _receiveRegistrationId = async () => {
        let registrationId: string = '';
        const onReceiveRegistrationId = (event: any) => {
            registrationId = event.registrationId;
            console.log(registrationId)
        };
        document.addEventListener('jpush.receiveRegistrationId', onReceiveRegistrationId, false)
    }

    /** 获取 RegistrationID */
    private _setRegistrationID = async () => {
        this._registrationId = '';
        await this._jpush.getRegistrationID()
            .then(rId => {
                this._registrationId = rId;
                this._printMsg.print(rId, '极光推送:RegistrationID - 成功', this._debug);
            })
            .catch(error => {
                this._printMsg.print(error, '极光推送:RegistrationID - 错误', this._debug);
            });
    }

    /** 判断系统设置中是否允许当前应用推送 */
    public getUserNotificationSettings = async (): Promise<boolean> => {
        let result: boolean = false;
        await this._jpush.getUserNotificationSettings().then(res => {
            if (+res === 0) {
                this._msg.toast(`无法接收到推送信息，请在系统设置允许当前应用推送`);
                result = false;
            } else {
                result = true;
            }
        });
        return Promise.resolve(result);
    }

}