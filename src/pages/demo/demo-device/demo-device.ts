import { Component } from '@angular/core';
import { DeviceService, DeviceInfo } from '../../../serves/native/device';



@Component({
  selector: 'page-demo-device',
  templateUrl: 'demo-device.html',
})
export class DemoDevicePage {

  public deviceInfo: DeviceInfo = {
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
    private _device: DeviceService,
  ) {
  }

  ionViewDidLoad() {
    this._getDeviceInfo();
  }

  private _getDeviceInfo = async () => {
    this.deviceInfo = await this._device.getDeviceInfo();
  }

}
