import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';

/* 设备 */
@Injectable()
export class DeviceService {

    private _isApp: boolean = this._platform.is('cordova');

    private _deviceInfo: DeviceInfo = {
        cordova: '',
        model: '',
        platform: '',
        uuid: '',
        version: '',
        manufacturer: '',
        isVirtual: false,
        serial: '',
    };

    constructor(
        private _platform: Platform,
        private _device: Device,
    ) {
        
    }

    /** 获取设备信息 */
    public getDeviceInfo = async ():Promise<DeviceInfo> => {
        await this._platform.ready();
        if (this._isApp) {
            this._deviceInfo.cordova = this._device.cordova;
            this._deviceInfo.model = this._device.model;
            this._deviceInfo.platform = this._device.platform;
            this._deviceInfo.uuid = this._device.uuid;
            this._deviceInfo.version = this._device.version;
            this._deviceInfo.manufacturer = this._device.manufacturer;
            this._deviceInfo.isVirtual = this._device.isVirtual;
            this._deviceInfo.serial = this._device.serial;
        }
        return Promise.resolve(this._deviceInfo);
    }
}

export interface DeviceInfo {
    cordova: string;
    model: string;
    platform: string;
    uuid: string;
    version: string;
    manufacturer: string;
    isVirtual: boolean;
    serial: string;
}