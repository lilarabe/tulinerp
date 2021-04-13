import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { WxJsSdkService } from '../../serves/wx-js-sdk.service';


@Injectable()
export class GeolocationService {

    /** 是否在App中 */
    private _isApp: boolean = this._platform.is('cordova');
    /** 是否在微信中 */

    constructor(
        private _platform: Platform,
        private _wxJsSdkService: WxJsSdkService,
    ) {
    }

    /** 获取定位 */
    public getGeolocation = async (): Promise<any> => {
        return new Promise(async (resolve) => {
            let lat = 0;
            let lng = 0;
            /** 微信 */
            if (!this._isApp && this._wxJsSdkService.isWeixn()) {
                let {lat, lng} = await this._wxJsSdkService.getLocation(); 
                resolve({ lng, lat });
                return;
            }
            const onSuccess = (position) => {
                lat = position.coords.latitude ? position.coords.latitude : 0;
                lng = position.coords.longitude ? position.coords.longitude : 0;
                resolve({ lng, lat });
            };
            const onError = (error) => {
                console.log(`%c无法获取定位信息:${JSON.stringify(error)}`, 'color:red;');
                resolve({ lng, lat });
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
            // resolve({lng:121.429746, lat:31.168023});
        });

    }

}