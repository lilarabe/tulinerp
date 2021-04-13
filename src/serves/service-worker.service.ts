import { Injectable } from '@angular/core';

@Injectable()
export class ServiceWorkerService {

    private debug: boolean = true;
    /** 公钥 vapidPublicKey */
    private _applicationServerPublicKey: string = 'BLmm0K7SIPiobF0EtWTsrvu4M-s18qG4dVKccNFvmJeqxZv7eEqv_gvLATdwQ37Ws6YENnsNEsbntLuj4DW72KU';

    constructor(
    ) {
    }

    /**
     * 调试信息
     * 
     * @private
     * @memberof ServiceWorkerProvider
     */
    private msg = (msg): void => {
        if (this.debug) {
            console.log(msg);
        }
    }

    /**
     * 测试是否支持 serviceWorker
     * 
     * @private
     * @memberof ServiceWorkerProvider
     */
    private _testSupport = (): boolean => {
        let result: boolean = false;
        if ('serviceWorker' in navigator && 'Notification' in window) {
            result = true;
        } else {
            this.msg('客户端不支持 serviceWorker,Notification');
            result = false;
        }
        return result;
    }

    /**
     * 测试是否许可通知
     * 
     * @private
     * @memberof ServiceWorkerProvider
     */
    private _testPermission = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (this._testSupport()) {
                if (Notification['permission'] === 'granted') {
                    resolve(true);
                } else {
                    /* 发起询问 */
                    Notification.requestPermission((status) => {
                        if (status === 'granted') {
                            resolve(true);
                        } else {
                            this.msg('客户端不许可');
                            resolve(false);
                        }
                    });
                }
            } else {
                resolve(false);
            }
        });
    }


    /**
     * 注册
     * 
     * @private 
     * @memberof ServiceWorkerProvider
     */
    private _register = (): Promise<ServiceWorkerRegistration> => {
        return new Promise((resolve) => {
            if (this._testSupport()) {
                const swUrl: string = 'sw.js';
                navigator.serviceWorker.register(swUrl).then((registration: ServiceWorkerRegistration) => {
                    resolve(registration);
                });
            } else {
                resolve(null);
            }
        });
    }

    /**
     * 创建通知
     * 
     * @public
     * @memberof ServiceWorkerProvider
     */
    public showNotification = async (title, options) => {
        const isSupported: boolean = this._testSupport();
        const isPermission: boolean = await this._testPermission();
        const registration: ServiceWorkerRegistration = await this._register();
        // console.log(isSupported, isPermission, registration);
        this._registerServer(registration);
        if (isSupported && isPermission && registration) {
            // await registration.showNotification(title, options);
        } else {
            this.msg('消息发送失败');
        }
    }

    /** 将base64公钥转换成 Uint8Array 格式*/
    private _urlBase64ToUint8Array = (base64String): Uint8Array => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /** 注册服务器 */
    private _registerServer = async (registration: ServiceWorkerRegistration) => {
        /** 将base64公钥转换成 Uint8Array 格式*/
        const applicationServerKey: Uint8Array = this._urlBase64ToUint8Array(this._applicationServerPublicKey);
        /** 发送到服务器，服务器将返回一组订阅信息 */
        try {
            console.log(`pushSubscription start`);
            const pushSubscription: PushSubscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
            console.log(`pushSubscription OK:`);
            console.log(JSON.stringify(pushSubscription));
            console.log(pushSubscription);
            console.log(pushSubscription.endpoint);
        } catch (e) {
            console.log(`pushSubscription Error:`);
            console.log(e);
            console.log(JSON.stringify(e));
        }
    }

}
